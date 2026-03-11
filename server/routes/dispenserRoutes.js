const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  getMyDispenser,
  getAllDispensers,
  createDispenser,
  updateDispenserStatus,
  triggerDose,
  resetCompartment,
} = require("../controllers/dispenserController");

// Patient views their own dispenser
router.get("/mine", auth, getMyDispenser);

// Admin views all dispensers
router.get("/all", auth, getAllDispensers);

// Admin creates or upserts a dispenser by deviceId
router.post("/create", auth, createDispenser);

// Update a dispenser's connection status, missed doses, or last activity
router.put("/status", auth, updateDispenserStatus);

// Trigger a dose dispense on a specific compartment (simulates servo unlock)
router.put("/trigger", auth, triggerDose);

// Reset a specific compartment back to "Locked"
router.put("/reset", auth, resetCompartment);

module.exports = router;
