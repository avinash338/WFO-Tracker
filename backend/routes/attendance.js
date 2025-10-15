// const express = require("express");
// const Attendance = require("../models/Attendance");
// const router = express.Router();

// router.post("/submit", async (req, res) => {
//   try {
//     const { userId, userEmail, date, status } = req.body;
//     const attendance = new Attendance({ userId, userEmail, date, status });
//     await attendance.save();
//     res.json({ message: "Attendance saved!" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/:userId/:month", async (req, res) => {
//   try {
//     const { userId, month } = req.params;
//     const records = await Attendance.find({
//       userId,
//       date: { $regex: `^${month}` }
//     }).sort({ date: 1 });
//     const filteredRecords = records.map(r => ({
//       userId: r.userId,
//       userEmail: r.userEmail,
//       date: r.date,
//       status: r.status
//     }));
//     res.json(filteredRecords);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const router = express.Router();

// POST /submit
router.post("/submit", async (req, res) => {
  try {
    const { userId, userEmail, date, status } = req.body;

    // Validate required fields
    if (!userId || !userEmail || !date || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const attendance = new Attendance({ userId, userEmail, date, status });
    await attendance.save();
    res.json({ message: "Attendance saved!" });
  } catch (err) {
    console.error("POST /submit error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /:userId/:month
router.get("/:userId/:month", async (req, res) => {
  try {
    const { userId, month } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Validate month format YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "Invalid month format, use YYYY-MM" });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const records = await Attendance.find({
      userId,
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: 1 });

    const filteredRecords = records.map(r => ({
      userId: r.userId,
      userEmail: r.userEmail,
      date: r.date,
      status: r.status
    }));

    res.json(filteredRecords);
  } catch (err) {
    console.error("GET /:userId/:month error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
