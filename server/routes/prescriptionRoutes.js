const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  createPrescription,
  getMyPrescriptions,
  getDoctorPrescriptions,
  getAllPrescriptions,
  dispensePrescription,
  authorizePrescription,
} = require("../controllers/prescriptionController");

// Doctor creates a new prescription
router.post("/create", auth, createPrescription);

// Patient views their own prescriptions
router.get("/mine", auth, getMyPrescriptions);

// Doctor views all prescriptions they have written
router.get("/doctor", auth, getDoctorPrescriptions);

// Pharmacist/admin views all active prescriptions
router.get("/all", auth, getAllPrescriptions);

// Pharmacist marks a prescription as dispensed
router.put("/dispense", auth, dispensePrescription);

// Patient authorizes a prescription
router.put("/authorize", auth, authorizePrescription);

module.exports = router;
