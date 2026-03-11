const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
require("./db/conn");

const { initSocket } = require("./controllers/socket");
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");
const notificationRouter = require("./routes/notificationRouter");
const medicalRecordRouter = require("./routes/medicalRecordRoutes");
const prescriptionRouter = require("./routes/prescriptionRoutes");
const accessLogRouter = require("./routes/accessLogRoutes");
const dispenserRouter = require("./routes/dispenserRoutes");

const app = express();
const port = process.env.PORT || 5015;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());

// API routes
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/medicalrecord", medicalRecordRouter);
app.use("/api/prescription", prescriptionRouter);
app.use("/api/accesslog", accessLogRouter);
app.use("/api/dispenser", dispenserRouter);

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Serve React build
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Attach Socket.IO to the HTTP server
initSocket(server);
