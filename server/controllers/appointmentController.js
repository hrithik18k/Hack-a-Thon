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
    const { doctorId, date, time, reason, doctorname } = req.body;

    const user = await User.findById(req.locals);

    // Calculate age from dateOfBirth
    let calculatedAge = 0;
    if (user.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(user.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = age;
    }

    const appointment = new Appointment({
      userId: req.locals,
      doctorId,
      date,
      time,
      age: calculatedAge,
      gender: user.gender || "",
      bloodGroup: user.bloodGroup || "",
      reason,
      status: "Pending"
    });

    await appointment.save();

    const usernotification = new Notification({
      userId: req.locals,
      content: `You booked an appointment with Dr. ${doctorname || 'Doctor'} for ${date} at ${time}`,
    });
    await usernotification.save();

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

const getavailableslots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) return res.status(400).json({ success: false, message: "Missing parameters" });

    const Doctor = require("../models/doctorModel");
    const doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    const { startTime, endTime, duration } = doctor.slotConfig || { startTime: "09:00", endTime: "17:00", duration: 30 };

    // Generate slots
    const slots = [];
    let [sH, sM] = startTime.split(":").map(Number);
    const [eH, eM] = endTime.split(":").map(Number);
    
    let current = sH * 60 + sM;
    const end = eH * 60 + eM;

    while (current + duration <= end) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      current += duration;
    }

    // Find booked
    const bookedAppointments = await Appointment.find({ doctorId, date, status: { $ne: "Cancelled" } });
    const bookedTimes = bookedAppointments.map(a => a.time);

    const availableSlots = slots.map(time => ({
      time,
      isBooked: bookedTimes.includes(time)
    }));

    return res.status(200).json({ success: true, data: availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to get available slots" });
  }
};

module.exports = {
  getallappointments,
  bookappointment,
  completed,
  getavailableslots,
};
