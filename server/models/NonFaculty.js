
const mongoose = require("mongoose");

const nonFacultySchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true
    },

    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    gender: {
      type: String
    },

    email: {
      type: String
    },

    contactNumber: {
      type: String
    },

    position: {
      type: String
    },

    department: {
      type: String
    },

    employmentStatus: {
      type: String,
      default: "Active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "NonFaculty",
  nonFacultySchema
);
