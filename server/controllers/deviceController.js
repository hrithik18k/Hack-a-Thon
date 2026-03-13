const DeviceState   = require("../models/deviceStateModel");
const User          = require("../models/userModel");
const MedicalReport = require("../models/medicalReportModel");
 
// ── Helper: get or create the singleton doc ──────────────────
const getState = async () => {
  let state = await DeviceState.findOne({ key: "main" });
  if (!state) state = await DeviceState.create({ key: "main" });
  return state;
};
 
// ─────────────────────────────────────────────────────────────
// POST /api/device/setmode
// Called by: website (doctor or patient)
// Body: { mode: "enroll" | "scan" | "idle", userId (optional) }
// ─────────────────────────────────────────────────────────────
const setMode = async (req, res) => {
  try {
    const { mode, userId } = req.body;
    const validModes = ["idle", "enroll", "scan"];
    if (!validModes.includes(mode)) {
      return res.status(400).json({ success: false, message: "Invalid mode" });
    }
 
    const state = await getState();
    state.mode          = mode;
    state.enrollUserId  = userId || req.locals; // enroll uses the logged-in user's id
    state.result        = null; // clear previous result
    await state.save();
 
    return res.status(200).json({ success: true, message: `Mode set to ${mode}` });
  } catch (err) {
    console.error("setMode error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// ─────────────────────────────────────────────────────────────
// GET /api/device/getmode
// Called by: ESP32 (polls every 3 seconds)
// ─────────────────────────────────────────────────────────────
const getMode = async (req, res) => {
  try {
    const state = await getState();
    return res.status(200).json({
      success: true,
      data: {
        mode:   state.mode,
        userId: state.enrollUserId, // ESP32 expects 'userId'
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/device/result
// Called by: ESP32 after completing enroll or scan
// ─────────────────────────────────────────────────────────────
const postResult = async (req, res) => {
  try {
    const { status, templateId, userId, error } = req.body;
    const state = await getState();

    // 1. Enrollment Handlers
    if (status === "enroll_success") {
      if (!userId) return res.status(400).json({ success: false, message: "userId required" });
      await User.findByIdAndUpdate(userId, { fingerprintTemplateId: templateId });
      
      state.mode   = "idle";
      state.result = { status: "enrolled", templateId, timestamp: new Date() };
      await state.save();
      return res.status(200).json({ success: true, message: "Fingerprint enrolled" });
    } 
    
    if (status === "enroll_error") {
      state.mode   = "idle";
      state.result = { status: "error", message: error || "Enrollment failed", timestamp: new Date() };
      await state.save();
      return res.status(200).json({ success: true, message: "Enroll error logged" });
    }

    // 2. Scan Handlers
    if (status === "scan_success") {
      const user = await User.findOne({ fingerprintTemplateId: templateId }).select("-password");
      if (!user) {
        state.result = { status: "not_found", timestamp: new Date() };
      } else {
        const reports = await MedicalReport.find({ patientId: user._id }).sort({ createdAt: -1 });
        state.result = {
          status:    "found",
          templateId,
          user:      user.toObject(),
          reports:   reports.map(r => r.toObject()),
          timestamp: new Date(),
        };
      }
      state.mode = "idle";
      await state.save();

      // Return data for the ESP32 OLED
      return res.status(200).json({ 
        success: true, 
        data: { 
          patient: { firstname: user?.firstname || "Unknown", lastname: user?.lastname || "" },
          reportCount: state.result.reports?.length || 0
        } 
      });
    }

    if (status === "scan_notfound") {
      state.mode = "idle";
      state.result = { status: "not_found", timestamp: new Date() };
      await state.save();
      return res.status(200).json({ success: true, message: "No match" });
    }

    return res.status(400).json({ success: false, message: "Invalid status" });
  } catch (err) {
    console.error("postResult error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// ─────────────────────────────────────────────────────────────
// GET /api/device/result
// Called by: frontend (Emergency page polls this)
// Returns whatever the ESP32 last pushed
// ─────────────────────────────────────────────────────────────
const getResult = async (req, res) => {
  try {
    const state = await getState();
    return res.status(200).json({ success: true, data: state.result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 
module.exports = { setMode, getMode, postResult, getResult };
