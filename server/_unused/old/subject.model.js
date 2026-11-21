
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    dept: {
      type: String,
      required: true,
      trim: true
    },
    faculty: {
      type: String,
      required: true,
      trim: true
    },
    units: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    timestamps: true,
    collection: 'subjects'
  }
);

module.exports = mongoose.model('Subject', subjectSchema);
