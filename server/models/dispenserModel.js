const mongoose = require("mongoose");

const compartmentSchema = new mongoose.Schema({
  label: { type: String },
  medication: { type: String },
  dosage: { type: String },
  scheduleTime: { type: String },
  status: {
    type: String,
    enum: ["Locked", "Unlocked", "Dispensed"],
    default: "Locked",
  },
});

const dispenserSchema = new mongoose.Schema(
  {
    deviceId: { type: String, unique: true, required: true },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: { type: String, required: true },
    compartments: { type: [compartmentSchema], default: [] },
    connectionStatus: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
    },
    missedDoses: { type: Number, default: 0 },
    lastActivity: { type: Date },
    familyAlertPhone: { type: String, default: "" },
    familyAlertEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispenser", dispenserSchema);
