const AccessLog = require("../models/accessLogModel");

// POST /request — create a new access log entry with status "Pending"
const requestAccess = async (req, res) => {
  try {
    const requestedBy = req.locals;
    const log = await AccessLog.create({
      ...req.body,
      requestedBy,
      status: "Pending",
      ipAddress: req.ip || "",
    });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /mine — patient sees all access logs for their record
const getMyAccessLogs = async (req, res) => {
  try {
    const patientId = req.locals;
    const logs = await AccessLog.find({ patientId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /requests — doctor/pharmacist sees their own outbound access requests
const getAccessRequests = async (req, res) => {
  try {
    const requestedBy = req.locals;
    const logs = await AccessLog.find({ requestedBy }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /approve — patient approves an access request
const approveAccess = async (req, res) => {
  try {
    const { logId, authMethod } = req.body;
    const log = await AccessLog.findByIdAndUpdate(
      logId,
      { $set: { status: "Approved", authMethod: authMethod || "OTP" } },
      { new: true }
    );
    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "Access log not found" });
    }
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /deny — patient denies an access request
const denyAccess = async (req, res) => {
  try {
    const { logId } = req.body;
    const log = await AccessLog.findByIdAndUpdate(
      logId,
      { $set: { status: "Denied" } },
      { new: true }
    );
    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "Access log not found" });
    }
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /all — admin sees all access logs
const getAllAccessLogs = async (req, res) => {
  try {
    const logs = await AccessLog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  requestAccess,
  getMyAccessLogs,
  getAccessRequests,
  approveAccess,
  denyAccess,
  getAllAccessLogs,
};
