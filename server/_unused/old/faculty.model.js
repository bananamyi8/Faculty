const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    position: { type: String, required: true, trim: true },
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; },
    },
  }
);

module.exports = mongoose.model('Faculty', facultySchema);
