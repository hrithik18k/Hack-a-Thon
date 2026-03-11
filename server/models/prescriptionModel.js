const mongoose = require("mongoose");

const medicationItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String },
  frequency: { type: String },
  duration: { type: String },
  notes: { type: String },
});

const prescriptionSchema = new mongoose.Schema(
  {
    prescriptionId: {
      type: String,
      unique: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: { type: String, required: true },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorName: { type: String, required: true },
    hospital: { type: String, default: "" },
    medications: { type: [medicationItemSchema], default: [] },
    diagnosis: { type: String, default: "" },
    allergies: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["Active", "Dispensed", "Expired", "Cancelled"],
      default: "Active",
    },
    dispensedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dispensedAt: { type: Date },
    dispensedPharmacy: { type: String },
    authorizationRequired: { type: Boolean, default: false },
    patientAuthorized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
