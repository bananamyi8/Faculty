const Faculty = require("../models/faculty.mongo.model");
const Counter = require("../models/counter.mongo.model");

async function nextFacultyId() {
  const counter = await Counter.findOneAndUpdate(
    { _id: "facultyId" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return counter.sequence_value;
}

async function findAll() {
  return Faculty.find().sort({ facultyId: 1 }).lean();
}

async function findById(id) {
  return Faculty.findOne({ facultyId: id }).lean();
}

async function findByEmail(email) {
  return Faculty.findOne({ email: email.toLowerCase() }).lean();
}

async function create(data) {
  const facultyId = await nextFacultyId();
  const item = await Faculty.create({
    facultyId,
    ...data,
    status: "ACTIVE",
    updatedAt: new Date(),
    disabledAt: null
  });
  return item.toObject();
}

async function update(id, data) {
  return Faculty.findOneAndUpdate(
    { facultyId: id },
    { $set: { ...data, updatedAt: new Date() } },
    { new: true, runValidators: true }
  ).lean();
}

async function disable(id) {
  const now = new Date();
  return Faculty.findOneAndUpdate(
    { facultyId: id },
    { $set: { status: "INACTIVE", disabledAt: now, updatedAt: now } },
    { new: true, runValidators: true }
  ).lean();
}

module.exports = { findAll, findById, findByEmail, create, update, disable };
