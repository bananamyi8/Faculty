const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    facultyId: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    },
    updatedAt: { type: Date, default: Date.now },
    disabledAt: { type: Date, default: null }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Faculty", facultySchema);
