const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    certificate: {
      type: String,
      default: "",
    },
    slotConfig: {
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "17:00" },
      duration: { type: Number, default: 30 }
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", schema);

module.exports = Doctor;
