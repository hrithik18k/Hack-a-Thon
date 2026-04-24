const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const {
  validateLoginPayload,
  validateRegisterPayload,
  validateProfileUpdatePayload,
  validateChangePasswordPayload,
  validateForgotPasswordPayload,
  validateResetPasswordPayload,
} = require("../lib/userValidation");

const sanitizeUser = (user) => {
  if (!user) return null;
  const plainUser = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete plainUser.password;
  return plainUser;
};

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return process.env.JWT_SECRET;
};

const getuser = async (req, res) => {
  try {
    if (req.userRole !== "Admin" && req.locals !== req.params.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
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
    const validation = validateLoginPayload(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const { email, password, role } = validation.data;
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
      getJwtSecret(),
      { expiresIn: "2 days" }
    );
    return res.status(200).json({ success: true, data: { token, user: sanitizeUser(user) } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to login user" });
  }
};

const register = async (req, res) => {
  try {
    const validation = validateRegisterPayload(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const {
      firstname, lastname, email, password, phone, city, dateOfBirth, gender, bloodGroup, role,
      pic, permanentAddress, temporaryAddress, emergencyContact, doctorData,
    } = validation.data;
    
    const emailPresent = await User.findOne({ email });
    if (emailPresent) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    if (role === "Admin") {
      return res.status(403).json({ success: false, message: "Admin registration is prohibited" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    
    // Create base user
    const user = new User({
      firstname, lastname, email, password: hashedPass, phone, city, role,
      dateOfBirth: dateOfBirth || null,
      gender: gender || "",
      bloodGroup: bloodGroup || "",
      pic: pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      permanentAddress: permanentAddress || "",
      temporaryAddress: temporaryAddress || "",
      emergencyContact: emergencyContact || { name: "", relation: "", phone1: "", phone2: "" }
    });
    
    await user.save();

    // If doctor, create pending doctor application
    if (role === "Doctor") {
      const { specialization, experience, fees, qualifications, hospitalName, certificate } = doctorData;
      const doctor = new Doctor({
        userId: user._id,
        specialization,
        experience,
        fees,
        qualifications,
        hospitalName,
        city,
        certificate: certificate || ""
      });
      await doctor.save();
    }

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: error.message || "Unable to register user" });
  }
};

const updateprofile = async (req, res) => {
  try {
    const validation = validateProfileUpdatePayload(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const result = await User.findByIdAndUpdate(req.locals, validation.data, {
      new: true,
      runValidators: true,
    }).select("-password");
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
    const validation = validateChangePasswordPayload(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const { currentPassword, newPassword } = validation.data;

    const user = await User.findById(req.locals);
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
    const validation = validateForgotPasswordPayload(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const { email } = validation.data;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: "10m" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const fromName = process.env.EMAIL_FROM || "Doctor Appointment Support";
    const fromEmail = process.env.EMAIL_USER;

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: process.env.EMAIL_SUB || "Password Reset",
      text: `${process.env.EMAIL_TEXT || "Your reset link: "}${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Nodemailer error:", error);
        return res.status(500).json({ success: false, message: "Error sending email" });
      } else {
        return res.status(200).json({ success: true, message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const validation = validateResetPasswordPayload(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const { password } = validation.data;
    jwt.verify(token, getJwtSecret(), async (err, decoded) => {
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
