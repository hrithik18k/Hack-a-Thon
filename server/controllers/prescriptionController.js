const Prescription = require("../models/prescriptionModel");
const User = require("../models/userModel");

// POST /create — doctor creates a new prescription
const mongoose = require("mongoose");

const createPrescription = async (req, res) => {
  try {
    const doctorId = req.locals;
    
    // Explicitly pick fields from req.body
    const { patientId, patientName, diagnosis, medications, allergies, hospital, authorizationRequired } = req.body;

    // Validate patientId
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      console.log("Invalid patientId provided:", patientId);
      return res.status(400).json({ success: false, message: `Invalid patientId: ${patientId}` });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    const doctorName = `${doctor.firstname} ${doctor.lastname}`;

    const prescriptionId = "RX-" + Date.now();
    
    const prescription = new Prescription({
      patientId,
      patientName,
      diagnosis,
      medications: medications || [],
      allergies: allergies || [],
      hospital: hospital || "",
      authorizationRequired: authorizationRequired || false,
      doctorId,
      doctorName,
      prescriptionId,
    });

    const savedPrescription = await prescription.save();
    console.log("Prescription saved successfully:", savedPrescription.prescriptionId);
    res.status(201).json({ success: true, data: savedPrescription });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

// GET /mine — patient sees their own prescriptions
const getMyPrescriptions = async (req, res) => {
  try {
    const patientId = req.locals;
    console.log("Fetching prescriptions for Patient ID:", patientId);
    const prescriptions = await Prescription.find({ patientId }).sort({
      createdAt: -1,
    });
    console.log(`Found ${prescriptions.length} prescriptions for patient ${patientId}`);
    res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    console.error("Error fetching patient prescriptions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /doctor — doctor sees all prescriptions they have written
const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctorId = req.locals;
    const prescriptions = await Prescription.find({ doctorId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /all — pharmacist/admin sees all active prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ status: "Active" }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /dispense — pharmacist marks a prescription as Dispensed
const dispensePrescription = async (req, res) => {
  try {
    const dispensedBy = req.locals;
    const { prescriptionId, dispensedPharmacy } = req.body;
    const prescription = await Prescription.findOneAndUpdate(
      { prescriptionId },
      {
        $set: {
          status: "Dispensed",
          dispensedBy,
          dispensedAt: new Date(),
          dispensedPharmacy: dispensedPharmacy || "",
        },
      },
      { new: true }
    );
    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found" });
    }
    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /authorize — patient authorizes a prescription
const authorizePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.body;
    const prescription = await Prescription.findOneAndUpdate(
      { prescriptionId },
      { $set: { patientAuthorized: true } },
      { new: true }
    );
    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found" });
    }
    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPrescription,
  getMyPrescriptions,
  getDoctorPrescriptions,
  getAllPrescriptions,
  dispensePrescription,
  authorizePrescription,
};
