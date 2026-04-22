const crypto = require("crypto");
const DeviceState   = require("../models/deviceStateModel");
const User          = require("../models/userModel");
const MedicalReport = require("../models/medicalReportModel");
const DoctorDevice  = require("../models/doctorDeviceModel");

// ── Helper: old global system ────────────────────────────────
const getState = async () => {
  let state = await DeviceState.findOne({ key: "main" });
  if (!state) state = await DeviceState.create({ key: "main" });
  return state;
};

// ─────────────────────────────────────────────────────────────
// WEBSITE-FACING: Update website routes to use DoctorDevice
// ─────────────────────────────────────────────────────────────

const setMode = async (req, res) => {
  try {
    const { mode, userId } = req.body;
    const validModes = ["idle", "enroll", "scan"];
    if (!validModes.includes(mode)) {
      return res.status(400).json({ success: false, message: "Invalid mode" });
    }

    // Find DoctorDevice for the logged-in doctor
    const device = await DoctorDevice.findOne({ doctorId: req.locals });
    if (!device) {
      return res.status(404).json({ success: false, message: "No device registered. Please register your device first." });
    }

    device.currentMode = mode;
    device.enrollTargetUserId = userId || req.locals;
    device.result = null; // clear previous result
    await device.save();

    return res.status(200).json({ success: true, message: `Mode set to ${mode}` });
  } catch (err) {
    console.error("setMode error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getResult = async (req, res) => {
  try {
    const device = await DoctorDevice.findOne({ doctorId: req.locals });
    if (!device) {
      return res.status(404).json({ success: false, message: "No device registered." });
    }
    return res.status(200).json({ success: true, data: device.result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// DOCTOR DEVICE MANAGEMENT (Frontend)
// ─────────────────────────────────────────────────────────────

const registerDevice = async (req, res) => {
  try {
    const { deviceName } = req.body;
    const deviceToken = crypto.randomUUID();

    let device = await DoctorDevice.findOne({ doctorId: req.locals });
    if (device) {
      device.deviceToken = deviceToken;
      if (deviceName) device.deviceName = deviceName;
      device.isActive = true;
      device.currentMode = "idle";
      device.result = null;
      await device.save();
    } else {
      device = await DoctorDevice.create({
        doctorId: req.locals,
        deviceToken,
        deviceName: deviceName || "Clinic Scanner",
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: { deviceToken: device.deviceToken, deviceName: device.deviceName } 
    });
  } catch (err) {
    console.error("registerDevice error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMyDevice = async (req, res) => {
  try {
    const device = await DoctorDevice.findOne({ doctorId: req.locals });
    if (!device) {
      return res.status(200).json({ success: true, data: null });
    }
    return res.status(200).json({ 
      success: true, 
      data: { 
        isActive: device.isActive, 
        deviceName: device.deviceName, 
        lastSeen: device.lastSeen, 
        currentMode: device.currentMode 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const unregisterDevice = async (req, res) => {
  try {
    const device = await DoctorDevice.findOne({ doctorId: req.locals });
    if (device) {
      device.isActive = false;
      await device.save();
    }
    return res.status(200).json({ success: true, message: "Device unregistered" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// ESP32-FACING: New Token-Based Routes
// ─────────────────────────────────────────────────────────────

const getModeESP = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;
    if (!token) return res.status(400).json({ success: false, message: "Token required" });

    const device = await DoctorDevice.findOne({ deviceToken: token, isActive: true });
    if (!device) return res.status(401).json({ success: false, message: "Invalid or inactive device token" });

    device.lastSeen = new Date();
    await device.save();

    return res.status(200).json({
      success: true,
      data: {
        mode: device.currentMode,
        userId: device.enrollTargetUserId,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const postResultESP = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;
    if (!token) return res.status(400).json({ success: false, message: "Token required" });

    const { status, templateId, userId, error } = req.body;
    
    const device = await DoctorDevice.findOne({ deviceToken: token, isActive: true });
    if (!device) return res.status(401).json({ success: false, message: "Invalid or inactive device token" });

    device.lastSeen = new Date();

    // 1. Enrollment Handlers
    if (status === "enroll_success") {
      if (!userId) return res.status(400).json({ success: false, message: "userId required" });
      await User.findByIdAndUpdate(userId, { fingerprintTemplateId: templateId });
      
      device.currentMode = "idle";
      device.result = { status: "enrolled", templateId, timestamp: new Date() };
      await device.save();
      return res.status(200).json({ success: true, message: "Fingerprint enrolled" });
    } 
    
    if (status === "enroll_error") {
      device.currentMode = "idle";
      device.result = { status: "error", message: error || "Enrollment failed", timestamp: new Date() };
      await device.save();
      return res.status(200).json({ success: true, message: "Enroll error logged" });
    }

    // 2. Scan Handlers
    if (status === "scan_success") {
      const user = await User.findOne({ fingerprintTemplateId: templateId }).select("-password");
      if (!user) {
        device.result = { status: "not_found", timestamp: new Date() };
        device.currentMode = "idle";
        await device.save();
        return res.status(200).json({ 
          success: true, 
          data: { 
            patient: { firstname: "Unknown", lastname: "" },
            reportCount: 0
          } 
        });
      }

      const reports = await MedicalReport.find({ patientId: user._id }).sort({ createdAt: -1 });
      device.result = {
        status:    "found",
        templateId,
        user:      user.toObject(),
        reports:   reports.map(r => r.toObject()),
        timestamp: new Date(),
      };
      
      device.currentMode = "idle";
      await device.save();

      // Return data for the ESP32 OLED
      return res.status(200).json({ 
        success: true, 
        data: { 
          patient: { firstname: user.firstname || "Unknown", lastname: user.lastname || "" },
          reportCount: device.result.reports.length || 0
        } 
      });
    }

    if (status === "scan_notfound") {
      device.currentMode = "idle";
      device.result = { status: "not_found", timestamp: new Date() };
      await device.save();
      return res.status(200).json({ success: true, message: "No match" });
    }

    return res.status(400).json({ success: false, message: "Invalid status" });
  } catch (err) {
    console.error("postResultESP error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// OLD ESP32-FACING GLOBAL ROUTES (For backward compatibility)
// ─────────────────────────────────────────────────────────────

const getMode = async (req, res) => {
  try {
    const state = await getState();
    return res.status(200).json({
      success: true,
      data: {
        mode:   state.mode,
        userId: state.enrollUserId,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const postResult = async (req, res) => {
  try {
    const { status, templateId, userId, error } = req.body;
    const state = await getState();

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

    if (status === "scan_success") {
      const user = await User.findOne({ fingerprintTemplateId: templateId }).select("-password");
      if (!user) {
        state.result = { status: "not_found", timestamp: new Date() };
        state.mode = "idle";
        await state.save();
        return res.status(200).json({ 
          success: true, 
          data: { 
            patient: { firstname: "Unknown", lastname: "" },
            reportCount: 0
          } 
        });
      }

      const reports = await MedicalReport.find({ patientId: user._id }).sort({ createdAt: -1 });
      state.result = {
        status:    "found",
        templateId,
        user:      user.toObject(),
        reports:   reports.map(r => r.toObject()),
        timestamp: new Date(),
      };
      
      state.mode = "idle";
      await state.save();

      return res.status(200).json({ 
        success: true, 
        data: { 
          patient: { firstname: user.firstname || "Unknown", lastname: user.lastname || "" },
          reportCount: state.result.reports.length || 0
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

module.exports = { 
  setMode, getResult, // Website facing
  registerDevice, getMyDevice, unregisterDevice, // Doctor Device management 
  getModeESP, postResultESP, // New ESP32 routes
  getMode, postResult, // Old ESP32 routes (backward compat)
};
