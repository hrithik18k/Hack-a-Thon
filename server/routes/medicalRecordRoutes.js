const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  getMyRecord,
  getPatientRecord,
  updateMedicalRecord,
  addVitalSign,
  addDiagnosis,
  addMedication,
} = require("../controllers/medicalRecordController");

// Patient gets their own medical record
router.get("/myrecord", auth, getMyRecord);

// Doctor/pharmacist accesses a specific patient's record (authorized)
router.get("/patient/:patientId", auth, getPatientRecord);

// Upsert the authenticated patient's medical record
router.put("/update", auth, updateMedicalRecord);

// Push a new vital sign entry to the patient's record
router.post("/vitalsign", auth, addVitalSign);

// Doctor adds a diagnosis to a patient's record
router.post("/diagnosis", auth, addDiagnosis);

// Push a new medication entry to the patient's record
router.post("/medication", auth, addMedication);

module.exports = router;
