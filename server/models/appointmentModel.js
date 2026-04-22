const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female", "other", ""],
    },
    bloodGroup: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed", "Cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", schema);

module.exports = Appointment;
