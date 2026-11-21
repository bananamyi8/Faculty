const mongoose = require("mongoose");

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;

const scheduleSchema = new mongoose.Schema(
  {
    scheduleId: { type: Number, unique: true, sparse: true },
    subject: { type: String, required: true, trim: true },
    faculty: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    day: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    startTime: { type: String, required: true, match: [TIME, "startTime must be HH:MM"] },
    endTime: { type: String, required: true, match: [TIME, "endTime must be HH:MM"] },
    room: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    id: false,
    collection: "schedules",
    toJSON: { transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } },
  }
);

scheduleSchema.pre("validate", function () {
  if (this.startTime && this.endTime && this.endTime <= this.startTime) {
    this.invalidate("endTime", "endTime must be later than startTime");
  }
});

module.exports = mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
