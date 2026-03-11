const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  notes: { type: String },
});

const reportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  medications: [medicationSchema],
  followUpDate: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model("MedicalReport", reportSchema);
