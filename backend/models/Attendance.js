const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["WFO", "WFH"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
