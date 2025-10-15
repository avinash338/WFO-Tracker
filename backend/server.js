const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
// ==================================================================
// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN,
//     credentials: true,
//   })
// );
// app.options("*", cors());
// ==================================================================
// CORS configuration
// const allowedOrigins = [process.env.CLIENT_ORIGIN];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like Postman or curl)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg = `CORS policy: Origin ${origin} not allowed`;
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );
// ==================================================================
app.use(cors({ origin: true, credentials: true }));
app.options("*", cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`API running on port ${PORT}`)))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use("/api/attendance", require("./routes/attendance"));







// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// // -------------------------
// // CORS Configuration
// // -------------------------
// const allowedOrigins = [
//   process.env.CLIENT_ORIGIN, // deployed frontend
//   "http://localhost:3000",   // local dev
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (Postman, curl)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
//       }
//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );

// // Preflight requests
// app.options("*", cors());

// // -------------------------
// // Middleware
// // -------------------------
// app.use(express.json());

// // -------------------------
// // Routes
// // -------------------------
// app.use("/api/attendance", require("./routes/attendance"));

// // -------------------------
// // MongoDB & Server Startup
// // -------------------------
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error("Error: MONGO_URI not set in environment variables");
//   process.exit(1);
// }

// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB connected successfully");
//     app.listen(PORT, () => console.log(`API running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err.message);
//     process.exit(1);
//   });

// // -------------------------
// // Global Error Handling
// // -------------------------
// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err);
//   res.status(500).json({ message: err.message || "Internal Server Error" });
// });

