const mongoose = require('mongoose');
const Schedule = require('../models/Schedule');

exports.getAll = async (req, res) => {
  try {
    const docs = await Schedule.find()
      .populate('subject')
      .populate('faculty')
      .sort({ day: 1, startTime: 1 });
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
    const doc = await Schedule.findById(req.params.id)
      .populate('subject')
      .populate('faculty');
    if (!doc) return res.status(404).json({ message: 'Schedule not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const doc = await Schedule.create(req.body);
    const saved = await Schedule.findById(doc._id)
      .populate('subject')
      .populate('faculty');
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
    const doc = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('subject')
      .populate('faculty');
    if (!doc) return res.status(404).json({ message: 'Schedule not found' });
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
    const doc = await Schedule.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Schedule deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};