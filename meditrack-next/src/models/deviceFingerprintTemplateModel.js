const mongoose = require("mongoose");

const deviceFingerprintTemplateSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorDevice",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fingerprintProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FingerprintProfile",
      default: null,
    },
    templateId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

deviceFingerprintTemplateSchema.index({ deviceId: 1, patientId: 1 }, { unique: true });
deviceFingerprintTemplateSchema.index({ deviceId: 1, templateId: 1 }, { unique: true });

const DeviceFingerprintTemplate =
  mongoose.models.DeviceFingerprintTemplate ||
  mongoose.model("DeviceFingerprintTemplate", deviceFingerprintTemplateSchema);

module.exports = DeviceFingerprintTemplate;
