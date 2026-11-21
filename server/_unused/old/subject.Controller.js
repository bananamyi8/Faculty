const mongoose = require('mongoose');
const Subject = require('../models/Subject');

exports.getAll = async (req, res) => {
  try {
    const docs = await Subject.find()
      .populate('department')
      .sort({ code: 1 });
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
    const doc = await Subject.findById(req.params.id).populate('department');
    if (!doc) return res.status(404).json({ message: 'Subject not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const doc = await Subject.create(req.body);
    const saved = await Subject.findById(doc._id).populate('department');
    res.status(201).json(saved);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: 'A subject with that code already exists' });
    }
    res.status(400).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const doc = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('department');
    if (!doc) return res.status(404).json({ message: 'Subject not found' });
    res.json(doc);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: 'A subject with that code already exists' });
    }
    res.status(400).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const doc = await Subject.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};