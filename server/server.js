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
const reportRouter = require("./routes/reportRoutes");

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
app.use("/api/report", reportRouter);

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Health check / root route
app.get("/", (req, res) => {
  res.json({ success: true, message: "MediConnect API is running 🚀" });
});

// Serve React build (only if client is built and co-located)
const clientBuildPath = path.join(__dirname, "../client/build");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Attach Socket.IO to the HTTP server
initSocket(server);
