const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    facultyId: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    disabledAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } },
  }
);

module.exports = mongoose.models.Faculty || mongoose.model("Faculty", facultySchema);
