const router = require('express').Router();
const mongoose = require('mongoose');
const Department = require('../models/Department');

router.get('/', async (req, res) => {
  res.json(await Department.find().sort('name'));
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  res.json(dept);
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await Department.create(req.body));
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Department already exists' });
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json(dept);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Department already exists' });
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;