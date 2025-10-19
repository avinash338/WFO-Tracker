const express = require("express");
const Attendance = require("../models/Attendance");
const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const { userId, userEmail, date, status } = req.body;
    const attendance = new Attendance({ userId, userEmail, date, status });
    const savedAttendance = await attendance.save();
    res.json({
      userId: savedAttendance.userId,
      userEmail: savedAttendance.userEmail,
      date: savedAttendance.date,
      status: savedAttendance.status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/update-status", async (req, res) => {
  try {
    const { userId, date } = req.body;
    const updatedAttendance = await Attendance.findOneAndUpdate(
      { userId, date, status: "WFO" },
      { status: null },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found or status not 'WFO'" });
    }

    res.json({
      userId: updatedAttendance.userId,
      userEmail: updatedAttendance.userEmail,
      date: updatedAttendance.date,
      status: updatedAttendance.status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:userId/:month", async (req, res) => {
  try {
    const { userId, month } = req.params;
    const records = await Attendance.find({
      userId,
      date: { $regex: `^${month}` }
    }).sort({ date: 1 });
    const filteredRecords = records.map(r => ({
      userId: r.userId,
      userEmail: r.userEmail,
      date: r.date,
      status: r.status
    }));
    res.json(filteredRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
