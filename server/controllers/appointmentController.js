const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

const getallappointments = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [{ userId: req.query.search }, { doctorId: req.query.search }],
        }
      : {};

    const appointments = await Appointment.find(keyword)
      .populate("doctorId", "-password")
      .populate("userId", "-password");
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to get appointments" });
  }
};

const bookappointment = async (req, res) => {
  try {
    const { doctorId, date, time, age, gender, bloodGroup, reason, doctorname } = req.body;

    const appointment = new Appointment({
      userId: req.locals, // from auth middleware
      doctorId,
      date,
      time,
      age,
      gender,
      bloodGroup,
      reason,
      status: "Pending"
    });

    await appointment.save();

    const usernotification = new Notification({
      userId: req.locals,
      content: `You booked an appointment with Dr. ${doctorname || 'Doctor'} for ${date} at ${time}`,
    });
    await usernotification.save();

    const user = await User.findById(req.locals);

    const doctornotification = new Notification({
      userId: doctorId,
      content: `You have an appointment with ${user.firstname} ${user.lastname} on ${date} at ${time}. Reason: ${reason}`,
    });
    await doctornotification.save();

    return res.status(201).json({ success: true, message: "Appointment booked successfully", data: appointment });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: "Unable to book appointment" });
  }
};

const completed = async (req, res) => {
  try {
    const { appointid, doctorId, doctorname } = req.body;

    await Appointment.findByIdAndUpdate(appointid, { status: "Completed" });

    // The patient who booked it
    const appointment = await Appointment.findById(appointid);

    const usernotification = new Notification({
      userId: appointment.userId,
      content: `Your appointment with Dr. ${doctorname || 'Doctor'} has been completed`,
    });
    await usernotification.save();

    return res.status(200).json({ success: true, message: "Appointment completed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to complete appointment" });
  }
};

module.exports = {
  getallappointments,
  bookappointment,
  completed,
};
