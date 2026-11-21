const Faculty = require("../models/faculty.model");
const Department = require("../models/department.model");
const nextId = require("../utils/ids");
const { sendError, notFound, badRequest, parseId, pick } = require("../utils/http");

const FIELDS = ["name", "department", "position", "email", "status"];

async function departmentExists(name) {
  return Boolean(await Department.exists({ department_name: name }));
}

exports.getAll = async (req, res) => {
  try {
    res.json(await Faculty.find().sort({ facultyId: 1 }));
  } catch (e) { sendError(res, e); }
};

exports.getOne = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return badRequest(res, "Invalid ID");
    const doc = await Faculty.findOne({ facultyId: id });
    if (!doc) return notFound(res, "Faculty record");
    res.json(doc);
  } catch (e) { sendError(res, e); }
};

exports.create = async (req, res) => {
  try {
    const data = pick(req.body, FIELDS);
    if (data.department && !(await departmentExists(data.department))) {
      return badRequest(res, `Department '${data.department}' does not exist. Add it first.`);
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const doc = await Faculty.create({ ...data, facultyId: await nextId(Faculty, "facultyId") });
        return res.status(201).json(doc);
      } catch (e) {
        const clash = e && e.code === 11000 && e.keyPattern && e.keyPattern.facultyId;
        if (!clash || attempt === 2) throw e;
      }
    }
  } catch (e) { sendError(res, e); }
};

exports.update = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return badRequest(res, "Invalid ID");
    const doc = await Faculty.findOne({ facultyId: id });
    if (!doc) return notFound(res, "Faculty record");
    const data = pick(req.body, FIELDS);
    if (data.department && !(await departmentExists(data.department))) {
      return badRequest(res, `Department '${data.department}' does not exist.`);
    }
    doc.set(data);
    if (data.status === "INACTIVE" && !doc.disabledAt) doc.disabledAt = new Date();
    if (data.status === "ACTIVE") doc.disabledAt = null;
    await doc.save();
    res.json(doc);
  } catch (e) { sendError(res, e); }
};

exports.disable = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return badRequest(res, "Invalid ID");
    const doc = await Faculty.findOneAndUpdate(
      { facultyId: id },
      { $set: { status: "INACTIVE", disabledAt: new Date() } },
      { new: true }
    );
    if (!doc) return notFound(res, "Faculty record");
    res.json(doc);
  } catch (e) { sendError(res, e); }
};

exports.remove = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return badRequest(res, "Invalid ID");
    const doc = await Faculty.findOneAndDelete({ facultyId: id });
    if (!doc) return notFound(res, "Faculty record");
    res.json({ message: "Faculty record deleted" });
  } catch (e) { sendError(res, e); }
};
