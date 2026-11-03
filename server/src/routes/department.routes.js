const express = require("express");
const router = express.Router();
const repository = require("../data/department.repository");

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function sendError(res, status, title, detail, instance) {
  return res.status(status).type("application/problem+json").json({
    type: "about:blank", title, status, detail, instance
  });
}

router.get("/", async (req, res, next) => {
  try {
    const data = await repository.findAll();
    res.status(200).json({ count: data.length, data });
  } catch (error) { next(error); }
});

router.get("/:departmentId", async (req, res, next) => {
  const id = parseId(req.params.departmentId);
  if (!id) return sendError(res, 400, "Bad Request", "Department ID must be a positive integer.", req.originalUrl);

  try {
    const department = await repository.findById(id);
    if (!department) return sendError(res, 404, "Department Not Found", "The requested department does not exist.", req.originalUrl);
    res.status(200).json({ data: department });
  } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  const { department_name, description } = req.body || {};
  if (typeof department_name !== "string" || !department_name.trim()) {
    return sendError(res, 400, "Bad Request", "department_name is required.", req.originalUrl);
  }

  try {
    const duplicate = await require("../models/department.mongo.model").findOne({
      department_name: department_name.trim()
    }).collation({ locale: "en", strength: 2 });

    if (duplicate) return sendError(res, 409, "Conflict", "This department already exists.", req.originalUrl);

    const created = await repository.create({
      department_name: department_name.trim(),
      description: typeof description === "string" ? description.trim() : ""
    });
    res.status(201).json({ message: "Department created successfully.", data: created });
  } catch (error) {
    if (error.code === 11000) return sendError(res, 409, "Conflict", "This department already exists.", req.originalUrl);
    next(error);
  }
});

router.put("/:departmentId", async (req, res, next) => {
  const id = parseId(req.params.departmentId);
  if (!id) return sendError(res, 400, "Bad Request", "Department ID must be a positive integer.", req.originalUrl);

  const { department_name, description } = req.body || {};
  if (typeof department_name !== "string" || !department_name.trim()) {
    return sendError(res, 400, "Bad Request", "department_name is required.", req.originalUrl);
  }

  try {
    const existing = await repository.findById(id);
    if (!existing) return sendError(res, 404, "Department Not Found", "The requested department does not exist.", req.originalUrl);

    const Department = require("../models/department.mongo.model");
    const duplicate = await Department.findOne({
      department_id: { $ne: id },
      department_name: department_name.trim()
    }).collation({ locale: "en", strength: 2 });

    if (duplicate) return sendError(res, 409, "Conflict", "Another department already uses this name.", req.originalUrl);

    const updated = await repository.update(id, {
      department_name: department_name.trim(),
      description: typeof description === "string" ? description.trim() : ""
    });
    res.status(200).json({ message: "Department updated successfully.", data: updated });
  } catch (error) {
    if (error.code === 11000) return sendError(res, 409, "Conflict", "Another department already uses this name.", req.originalUrl);
    next(error);
  }
});

module.exports = router;
