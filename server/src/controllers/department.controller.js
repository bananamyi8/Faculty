const Department = require("../models/department.model");
const Faculty = require("../models/faculty.model");
const nextId = require("../utils/ids");
const { sendError, notFound, badRequest, parseId, pick } = require("../utils/http");

const FIELDS = ["department_name", "description"];

exports.getAll = async (req, res) => {
  try {
    const data = await Department.find().sort({ department_id: 1 });
    res.json({ count: data.length, data });
  } catch (e) { sendError(res, e); }
};

exports.getOne = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return badRequest(res, "Invalid ID");
    const doc = await Department.findOne({ department_id: id });
    if (!doc) return notFound(res, "Department");
    res.json(doc);
  } catch (e) { sendError(res, e); }
};

exports.create = async (req, res) => {
  try {
    const data = pick(req.body, FIELDS);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const doc = await Department.create({ ...data, department_id: await nextId(Department, "department_id") });
        return res.status(201).json(doc);
      } catch (e) {
        const clash = e && e.code === 11000 && e.keyPattern && e.keyPattern.department_id;
        if (!clash || attempt === 2) throw e;
      }
    }
  } catch (e) { sendError(res, e); }
};

exports.update = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return badRequest(res, "Invalid ID");
    const doc = await Department.findOne({ department_id: id });
    if (!doc) return notFound(res, "Department");
    const oldName = doc.department_name;
    doc.set(pick(req.body, FIELDS));
    await doc.save();
    if (doc.department_name !== oldName) {
      await Faculty.updateMany({ department: oldName }, { $set: { department: doc.department_name } });
    }
    res.json(doc);
  } catch (e) { sendError(res, e); }
};

exports.remove = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return badRequest(res, "Invalid ID");
    const doc = await Department.findOne({ department_id: id });
    if (!doc) return notFound(res, "Department");
    if (await Faculty.exists({ department: doc.department_name })) {
      return res.status(409).json({
        message: "This department still has faculty assigned.",
        detail: "This department still has faculty assigned.",
      });
    }
    await doc.deleteOne();
    res.json({ message: "Department deleted" });
  } catch (e) { sendError(res, e); }
};
