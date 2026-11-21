const mongoose = require('mongoose');
const Department = require('../models/department.model');

exports.getAll = async (req, res) => {
  try {
    const docs = await Department.find().sort({ name: 1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const doc = await Department.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Department not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const doc = await Department.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: 'A department with that name already exists' });
    }
    res.status(400).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const doc = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) return res.status(404).json({ message: 'Department not found' });
    res.json(doc);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: 'A department with that name already exists' });
    }
    res.status(400).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const doc = await Department.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};