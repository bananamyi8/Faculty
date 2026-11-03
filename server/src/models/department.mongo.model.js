const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    department_id: { type: Number, unique: true, index: true },
    department_name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: { type: String, default: "", trim: true }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Department", departmentSchema);
