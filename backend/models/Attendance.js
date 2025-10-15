// const mongoose = require("mongoose");

// const AttendanceSchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   userEmail: { type: String, required: true },
//   date: { type: String, required: true },
//   status: { type: String, enum: ["WFO", "WFH"], required: true },
// }, { timestamps: true });

// module.exports = mongoose.model("Attendance", AttendanceSchema);


const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["WFO", "WFH"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
