const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
    },
    lastname: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Doctor", "Patient"],
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    age: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      default: "",
    },
    permanentAddress: {
      type: String,
      default: "",
    },
    temporaryAddress: {
      type: String,
      default: "",
    },
    emergencyContact: {
      name: { type: String, default: "" },
      relation: { type: String, default: "" },
      phone1: { type: String, default: "" },
      phone2: { type: String, default: "" },
    },
    fingerprintTemplateId: {
      type: Number,
      default: null,
    },
    
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", schema);

module.exports = User;
