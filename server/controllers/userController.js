const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to get user" });
  }
};

const getallusers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.locals } }).select("-password");
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to get all users" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Incorrect credentials" });
    }
    if (user.role !== role) {
      return res.status(404).json({ success: false, message: "Role does not exist" });
    }
    const verifyPass = await bcrypt.compare(password, user.password);
    if (!verifyPass) {
      return res.status(400).json({ success: false, message: "Incorrect credentials" });
    }

    // Check if Doctor is approved
    if (user.role === "Doctor") {
      const doctorDetails = await Doctor.findOne({ userId: user._id });
      if (doctorDetails && doctorDetails.status !== "Approved") {
         return res.status(403).json({ success: false, message: "Doctor account is pending approval or rejected." });
      }
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "2 days" }
    );
    return res.status(200).json({ success: true, data: { token, user } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to login user" });
  }
};

const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, phone, city, dateOfBirth, gender, role, specialization, experience, fees, qualifications, hospitalName, pic } = req.body;
    
    const emailPresent = await User.findOne({ email });
    if (emailPresent) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    
    // Create base user
    const user = new User({
      firstname, lastname, email, password: hashedPass, phone, city, role,
      dateOfBirth: dateOfBirth || null,
      gender: gender || "",
      pic: pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    });
    
    await user.save();

    // If doctor, create pending doctor application
    if (role === "Doctor") {
      const doctor = new Doctor({
        userId: user._id,
        specialization,
        experience,
        fees,
        qualifications,
        hospitalName,
        city
      });
      await doctor.save();
    }

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to register user" });
  }
};

const updateprofile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }
    const result = await User.findByIdAndUpdate(req.locals, updateData, { new: true });
    if (!result) {
      return res.status(500).json({ success: false, message: "Unable to update user" });
    }
    return res.status(200).json({ success: true, message: "User updated successfully", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to update user" });
  }
};

const changepassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteuser = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndDelete(userId);
    await Doctor.findOneAndDelete({ userId });
    await Appointment.deleteMany({ userId });
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to delete user" });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "10m" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: process.env.EMAIL_SUB || "Password Reset",
      text: `${process.env.EMAIL_TEXT || "Your reset link: "}${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ success: false, message: "Error sending email" });
      } else {
        return res.status(200).json({ success: true, message: "Email sent successfully" });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    jwt.verify(token, process.env.JWT_SECRET || "secret", async (err, decoded) => {
      if (err) {
        return res.status(400).json({ success: false, message: "Invalid or expired token" });
      }
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(id, { password: hashedPassword });
        return res.status(200).json({ success: true, message: "Password reset successfully" });
      } catch (updateError) {
        return res.status(500).json({ success: false, message: "Failed to update password" });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getuser,
  getallusers,
  login,
  register,
  updateprofile,
  deleteuser,
  changepassword,
  forgotpassword,
  resetpassword,
};
