const mongoose = require("mongoose");

const nonFacultySchema = new mongoose.Schema(
  {
    nonFacultyId: { type: Number, unique: true, sparse: true },
    employeeId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  {
    timestamps: true,
    id: false,
    collection: "nonfaculty",
    toJSON: { transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } },
  }
);

module.exports = mongoose.models.NonFaculty || mongoose.model("NonFaculty", nonFacultySchema);
