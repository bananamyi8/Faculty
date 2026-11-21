const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectId: { type: Number, unique: true, sparse: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, default: "", trim: true },
    units: { type: Number, required: true, min: 1 },
  },
  {
    timestamps: true,
    id: false,
    collection: "subjects",
    toJSON: { transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } },
  }
);

module.exports = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
