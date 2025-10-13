const express = require("express");
const Attendance = require("../models/Attendance");
const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const { userId, userEmail, date, status } = req.body;
    const attendance = new Attendance({ userId, userEmail, date, status });
    await attendance.save();
    res.json({ message: "Attendance saved!" });
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
