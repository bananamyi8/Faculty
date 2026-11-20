const router = require('express').Router();
const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const populate = { path: 'department', select: 'name description' };

async function validate(body) {
  const errors = {};
  if (!body.fullName || !String(body.fullName).trim()) errors.fullName = 'Full name is required';
  if (!body.position || !String(body.position).trim()) errors.position = 'Position is required';
  if (!body.email || !String(body.email).trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(body.email)) errors.email = 'Enter a valid email address';
  if (!body.department) errors.department = 'Department is required';
  else if (!mongoose.isValidObjectId(body.department) || !(await Department.exists({ _id: body.department })))
    errors.department = 'Selected department does not exist';
  return errors;
}

function checkId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.facultyId))
    return res.status(400).json({ message: 'Invalid faculty ID' });
  next();
}

// GET /api/v1/faculty
router.get('/', wrap(async (req, res) => {
  res.json(await Faculty.find().populate(populate).sort('fullName'));
}));

// GET /api/v1/faculty/:facultyId
router.get('/:facultyId', checkId, wrap(async (req, res) => {
  const f = await Faculty.findById(req.params.facultyId).populate(populate);
  if (!f) return res.status(404).json({ message: 'Faculty member not found' });
  res.json(f);
}));

// POST /api/v1/faculty
router.post('/', wrap(async (req, res) => {
  const errors = await validate(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Validation failed', errors });
  const created = await Faculty.create({
    fullName: req.body.fullName,
    department: req.body.department,
    position: req.body.position,
    email: req.body.email,
  });
  res.status(201).json(await created.populate(populate));
}));

// PUT /api/v1/faculty/:facultyId
router.put('/:facultyId', checkId, wrap(async (req, res) => {
  const errors = await validate(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Validation failed', errors });
  const f = await Faculty.findByIdAndUpdate(
    req.params.facultyId,
    {
      fullName: req.body.fullName,
      department: req.body.department,
      position: req.body.position,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  ).populate(populate);
  if (!f) return res.status(404).json({ message: 'Faculty member not found' });
  res.json(f);
}));

// PATCH /api/v1/faculty/:facultyId/disable
router.patch('/:facultyId/disable', checkId, wrap(async (req, res) => {
  const f = await Faculty.findByIdAndUpdate(
    req.params.facultyId,
    { status: 'INACTIVE' },
    { new: true }
  ).populate(populate);
  if (!f) return res.status(404).json({ message: 'Faculty member not found' });
  res.json(f);
}));

module.exports = router;
