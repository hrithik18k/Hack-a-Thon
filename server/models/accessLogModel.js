const mongoose = require("mongoose");

const accessLogSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterName: { type: String, required: true },
    requesterRole: { type: String, required: true },
    facility: { type: String, default: "" },
    purpose: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Denied", "Revoked"],
      default: "Pending",
    },
    authMethod: {
      type: String,
      enum: ["Fingerprint", "OTP", "Admin Override"],
      default: "OTP",
    },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccessLog", accessLogSchema);
