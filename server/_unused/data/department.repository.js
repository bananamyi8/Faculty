const Department = require("../models/department.mongo.model");
const Counter = require("../models/counter.mongo.model");

async function nextDepartmentId() {
  const counter = await Counter.findOneAndUpdate(
    { _id: "departmentId" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return counter.sequence_value;
}

async function findAll() {
  return Department.find().sort({ department_id: 1 }).lean();
}

async function findById(id) {
  return Department.findOne({ department_id: id }).lean();
}

async function create(data) {
  const department_id = await nextDepartmentId();
  const item = await Department.create({ department_id, ...data });
  return item.toObject();
}

async function update(id, data) {
  return Department.findOneAndUpdate(
    { department_id: id },
    { $set: data },
    { new: true, runValidators: true }
  ).lean();
}

module.exports = { findAll, findById, create, update };
