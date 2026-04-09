const express = require("express");
const { auth } = require("../middleware/auth");
const { 
  setMode, getResult, 
  registerDevice, getMyDevice, unregisterDevice, 
  getModeESP, postResultESP, 
  getMode, postResult 
} = require("../controllers/deviceController");

const deviceRouter = express.Router();

// ── Website → set mode / get result (requires auth) ───────────
deviceRouter.post("/setmode", auth, setMode);
deviceRouter.get("/result", auth, getResult);

// ── Doctor Device Management (requires auth) ───────────────────
deviceRouter.post("/doctor/register", auth, registerDevice);
deviceRouter.get("/doctor/my-device", auth, getMyDevice);
deviceRouter.delete("/doctor/unregister", auth, unregisterDevice);

// ── ESP32 Token-based Routes (no auth middleware, uses token) ──
deviceRouter.get("/esp/mode", getModeESP);
deviceRouter.post("/esp/result", postResultESP);

// ── Old ESP32 Routes (backward compatibility) ──────────────────
deviceRouter.get("/getmode", getMode);
deviceRouter.post("/result", postResult);

module.exports = deviceRouter;