const mongoose = require('mongoose');
const Faculty = require('../models/faculty.model');

exports.getAll = async (req, res) => {
  try {
    const docs = await Faculty.find().sort({ createdAt: -1 });
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
    const doc = await Faculty.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Faculty not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const doc = await Faculty.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const doc = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) return res.status(404).json({ message: 'Faculty not found' });
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
    const doc = await Faculty.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Faculty not found' });
    res.json({ message: 'Faculty deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};