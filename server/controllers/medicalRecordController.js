const MedicalRecord = require("../models/medicalRecordModel");
const AccessLog = require("../models/accessLogModel");

// GET /myrecord — patient gets their own record
const getMyRecord = async (req, res) => {
  try {
    const patientId = req.locals;
    let record = await MedicalRecord.findOne({ patientId });
    if (!record) {
      record = await MedicalRecord.create({ patientId });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /patient/:patientId — doctor/pharmacist accesses a patient's record (authorized)
const getPatientRecord = async (req, res) => {
  try {
    const { patientId } = req.params;
    const requestedBy = req.locals;

    let record = await MedicalRecord.findOne({ patientId });
    if (!record) {
      record = await MedicalRecord.create({ patientId });
    }

    // Log this access attempt
    await AccessLog.create({
      patientId,
      requestedBy,
      requesterName: req.body.requesterName || "Unknown",
      requesterRole: req.body.requesterRole || "Unknown",
      facility: req.body.facility || "",
      purpose: req.body.purpose || "Medical Records Access",
      status: "Approved",
      ipAddress: req.ip || "",
    });

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /update — upsert the patient's medical record
const updateMedicalRecord = async (req, res) => {
  try {
    const patientId = req.locals;
    const record = await MedicalRecord.findOneAndUpdate(
      { patientId },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /vitalsign — push a new vital sign to the patient's record
const addVitalSign = async (req, res) => {
  try {
    const patientId = req.locals;
    const record = await MedicalRecord.findOneAndUpdate(
      { patientId },
      { $push: { vitalSigns: req.body } },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /diagnosis — doctor adds a diagnosis for a patient
const addDiagnosis = async (req, res) => {
  try {
    const doctorId = req.locals;
    const { patientId, ...diagnosisData } = req.body;
    const record = await MedicalRecord.findOneAndUpdate(
      { patientId },
      { $push: { diagnoses: { ...diagnosisData, doctorId } } },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /medication — push a new medication to the patient's record
const addMedication = async (req, res) => {
  try {
    const patientId = req.locals;
    const record = await MedicalRecord.findOneAndUpdate(
      { patientId },
      { $push: { medications: req.body } },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyRecord,
  getPatientRecord,
  updateMedicalRecord,
  addVitalSign,
  addDiagnosis,
  addMedication,
};
