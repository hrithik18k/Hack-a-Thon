const mongoose = require("mongoose");

const doctorDeviceSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    deviceToken: {
      type: String,
      required: true,
      unique: true,
    },
    deviceName: {
      type: String,
      default: "Clinic Scanner",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    currentMode: {
      type: String,
      enum: ["idle", "enroll", "scan"],
      default: "idle",
    },
    enrollTargetUserId: {
      type: String,
      default: null,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const DoctorDevice = mongoose.model("DoctorDevice", doctorDeviceSchema);

module.exports = DoctorDevice;
