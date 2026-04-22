const MedicalReport = require("../models/medicalReportModel");
const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");

const createReport = async (req, res) => {
  try {
    const { appointmentId, diagnosis, notes, medications, followUpDate, importance, images } = req.body;
    
    // Removed debug logging
    
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    // Validate Doctor
    const docData = await Doctor.findOne({ userId: req.locals });
    if (!docData || docData.status !== "Approved") {
      return res.status(403).json({ success: false, message: "Only approved doctors can create reports" });
    }

    const doctorUser = await User.findById(req.locals);

    const importanceValue = (importance && (importance === "Important" || importance === "General")) ? importance : "General";

    // Create Report
    const report = new MedicalReport({
      patientId: appointment.userId,
      doctorId: appointment.doctorId,
      appointmentId,
      doctorName: `Dr. ${doctorUser.firstname} ${doctorUser.lastname}`,
      hospitalName: docData.hospitalName,
      appointmentDate: new Date(`${appointment.date} ${appointment.time}`),
      diagnosis,
      notes,
      importance: importanceValue,
      images: images || [],
      medications: medications || [],
      followUpDate: followUpDate ? new Date(followUpDate) : null,
    });

    await report.save();

    // Mark appointment as 'Completed' if not already
    appointment.status = "Completed";
    await appointment.save();

    return res.status(201).json({ success: true, message: "Report created successfully", data: report });
  } catch (error) {
    console.log("Error creating report:", error);
    res.status(500).json({ success: false, message: "Failed to create report" });
  }
};

const getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Optional validation: check if req.locals is a doctor
    const docData = await Doctor.findOne({ userId: req.locals });
    if (!docData || docData.status !== "Approved") {
      return res.status(403).json({ success: false, message: "Only approved doctors can view patient records" });
    }

    const reports = await MedicalReport.find({ patientId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get reports" });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ patientId: req.locals }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch your medical history" });
  }
};

const getReportByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const report = await MedicalReport.findOne({ appointmentId });
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve report" });
  }
};

module.exports = {
  createReport,
  getPatientReports,
  getMyReports,
  getReportByAppointment,
};
