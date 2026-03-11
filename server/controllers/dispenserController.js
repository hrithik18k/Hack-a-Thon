const Dispenser = require("../models/dispenserModel");

// GET /mine — patient sees their own dispenser
const getMyDispenser = async (req, res) => {
  try {
    const patientId = req.locals;
    const dispenser = await Dispenser.findOne({ patientId });
    if (!dispenser) {
      return res
        .status(404)
        .json({ success: false, message: "Dispenser not found" });
    }
    res.status(200).json({ success: true, data: dispenser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /all — admin sees all dispensers
const getAllDispensers = async (req, res) => {
  try {
    const dispensers = await Dispenser.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: dispensers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /create — admin creates or upserts a dispenser by deviceId
const createDispenser = async (req, res) => {
  try {
    const { deviceId } = req.body;
    const dispenser = await Dispenser.findOneAndUpdate(
      { deviceId },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: dispenser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /status — update connectionStatus, missedDoses, and lastActivity
const updateDispenserStatus = async (req, res) => {
  try {
    const { deviceId, connectionStatus, missedDoses, lastActivity } = req.body;
    const updateFields = {};
    if (connectionStatus !== undefined)
      updateFields.connectionStatus = connectionStatus;
    if (missedDoses !== undefined) updateFields.missedDoses = missedDoses;
    updateFields.lastActivity = lastActivity || new Date();

    const dispenser = await Dispenser.findOneAndUpdate(
      { deviceId },
      { $set: updateFields },
      { new: true }
    );
    if (!dispenser) {
      return res
        .status(404)
        .json({ success: false, message: "Dispenser not found" });
    }
    res.status(200).json({ success: true, data: dispenser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /trigger — set a compartment status to "Dispensed" (simulates servo unlock)
const triggerDose = async (req, res) => {
  try {
    const { deviceId, compartmentLabel } = req.body;
    const dispenser = await Dispenser.findOneAndUpdate(
      { deviceId, "compartments.label": compartmentLabel },
      {
        $set: {
          "compartments.$.status": "Dispensed",
          lastActivity: new Date(),
        },
      },
      { new: true }
    );
    if (!dispenser) {
      return res
        .status(404)
        .json({ success: false, message: "Dispenser or compartment not found" });
    }
    res.status(200).json({ success: true, data: dispenser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /reset — reset a compartment back to "Locked"
const resetCompartment = async (req, res) => {
  try {
    const { deviceId, compartmentLabel } = req.body;
    const dispenser = await Dispenser.findOneAndUpdate(
      { deviceId, "compartments.label": compartmentLabel },
      {
        $set: {
          "compartments.$.status": "Locked",
          lastActivity: new Date(),
        },
      },
      { new: true }
    );
    if (!dispenser) {
      return res
        .status(404)
        .json({ success: false, message: "Dispenser or compartment not found" });
    }
    res.status(200).json({ success: true, data: dispenser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyDispenser,
  getAllDispensers,
  createDispenser,
  updateDispenserStatus,
  triggerDose,
  resetCompartment,
};
