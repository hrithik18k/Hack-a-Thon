const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getalldoctors = async (req, res) => {
  try {
    const { city, specialization } = req.query;
    const filter = { status: "Approved" };
    if (city && city.trim() !== '') {
      // Escape regex special chars to prevent regex injection and use 'i' for case-insensitivity
      const safeCity = city.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.city = { $regex: safeCity, $options: "i" };
    }
    if (specialization && specialization.trim() !== '') {
      const safeSpec = specialization.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.specialization = { $regex: safeSpec, $options: "i" };
    }

    const docs = await Doctor.find(filter).populate("userId", "-password");
    return res.status(200).json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to get doctors" });
  }
};

const getnotdoctors = async (req, res) => {
  try {
    const docs = await Doctor.find({ status: "Pending" }).populate("userId", "-password");
    return res.status(200).json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to get non doctors" });
  }
};

const applyfordoctor = async (req, res) => {
  try {
    const alreadyFound = await Doctor.findOne({ userId: req.locals });
    if (alreadyFound) {
      return res.status(400).json({ success: false, message: "Application already exists" });
    }

    const doctor = new Doctor({ ...req.body, userId: req.locals });
    await doctor.save();
    return res.status(201).json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to submit application" });
  }
};

const acceptdoctor = async (req, res) => {
  try {
    const { userId } = req.body; // Using userId for consistency
    const doctor = await Doctor.findOneAndUpdate(
      { userId },
      { status: "Approved" },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    await User.findByIdAndUpdate(userId, { role: "Doctor" }); // ensure role mismatch is fixed

    const notification = new Notification({
      userId,
      content: `Congratulations, your application has been accepted.`,
    });
    await notification.save();

    return res.status(200).json({ success: true, message: "Application accepted notification sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error while accepting doctor" });
  }
};

const rejectdoctor = async (req, res) => {
  try {
    const { userId } = req.body;
    await Doctor.findOneAndUpdate({ userId }, { status: "Rejected" });
    
    const notification = new Notification({
      userId,
      content: `Sorry, your application has been rejected.`,
    });
    await notification.save();

    return res.status(200).json({ success: true, message: "Application rejection notification sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error while rejecting application" });
  }
};

const deletedoctor = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { role: "Patient" });
    await Doctor.findOneAndDelete({ userId });
    await Appointment.deleteMany({ doctorId: userId });
    return res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to delete doctor" });
  }
};

module.exports = {
  getalldoctors,
  getnotdoctors,
  deletedoctor,
  applyfordoctor,
  acceptdoctor,
  rejectdoctor,
};
