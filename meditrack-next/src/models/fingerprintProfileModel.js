const mongoose = require("mongoose");

const fingerprintProfileSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    globalFingerprintId: {
      type: String,
      required: true,
      unique: true,
    },
    enrolledByDoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lastEnrolledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const FingerprintProfile =
  mongoose.models.FingerprintProfile ||
  mongoose.model("FingerprintProfile", fingerprintProfileSchema);

module.exports = FingerprintProfile;
