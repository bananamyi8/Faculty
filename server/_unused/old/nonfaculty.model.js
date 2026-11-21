
const mongoose = require('mongoose');

const nonFacultySchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    photo: {
      type: String,
      default: ''
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Other'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    contactNumber: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    dateHired: {
      type: Date,
      default: Date.now
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contractual', 'Temporary'],
      default: 'Full-time'
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'On Leave'],
      default: 'Active'
    },
    history: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    collection: 'nonfaculty'
  }
);

module.exports = mongoose.model('NonFaculty', nonFacultySchema);
