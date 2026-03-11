const mongoose = require("mongoose");

const vitalSignSchema = new mongoose.Schema({
  date: { type: Date },
  bloodPressure: { type: String },
  heartRate: { type: Number },
  temperature: { type: Number },
  weight: { type: Number },
  oxygenSaturation: { type: Number },
});

const diagnosisSchema = new mongoose.Schema({
  date: { type: Date },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorName: { type: String },
  hospital: { type: String },
  diagnosis: { type: String },
  notes: { type: String },
});

const medicationSchema = new mongoose.Schema({
  name: { type: String },
  dosage: { type: String },
  frequency: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  prescribedBy: { type: String },
  status: { type: String, default: "Active" },
});

const surgerySchema = new mongoose.Schema({
  date: { type: Date },
  procedure: { type: String },
  hospital: { type: String },
  surgeon: { type: String },
  notes: { type: String },
});

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String },
  relation: { type: String },
  phone: { type: String },
});

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodGroup: { type: String, default: "" },
    allergies: { type: [String], default: [] },
    chronicConditions: { type: [String], default: [] },
    vitalSigns: { type: [vitalSignSchema], default: [] },
    diagnoses: { type: [diagnosisSchema], default: [] },
    medications: { type: [medicationSchema], default: [] },
    surgeries: { type: [surgerySchema], default: [] },
    emergencyContact: { type: emergencyContactSchema },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
