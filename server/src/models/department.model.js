const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    department_id: { type: Number, unique: true, sparse: true },
    department_name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    description: { type: String, default: "", trim: true },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } },
  }
);

module.exports = mongoose.models.Department || mongoose.model("Department", departmentSchema);
