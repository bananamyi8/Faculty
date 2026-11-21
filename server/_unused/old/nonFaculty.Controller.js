const mongoose = require('mongoose');
const NonFaculty = require('../models/nonfaculty.model');

exports.getAll = async (req, res) => {
  try {
    const docs = await NonFaculty.find()
      .populate('department')
      .sort({ createdAt: -1 });
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
    const doc = await NonFaculty.findById(req.params.id).populate('department');
    if (!doc) return res.status(404).json({ message: 'Non-faculty record not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const doc = await NonFaculty.create(req.body);
    const saved = await NonFaculty.findById(doc._id).populate('department');
    res.status(201).json(saved);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const doc = await NonFaculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('department');
    if (!doc) return res.status(404).json({ message: 'Non-faculty record not found' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const doc = await NonFaculty.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Non-faculty record not found' });
    res.json({ message: 'Non-faculty record deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};