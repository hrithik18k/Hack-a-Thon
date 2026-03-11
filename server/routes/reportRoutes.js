const express = require("express");
const { auth } = require("../middleware/auth");
const reportController = require("../controllers/reportController");

const reportRouter = express.Router();

reportRouter.post("/create", auth, reportController.createReport);
reportRouter.get("/patient/:patientId", auth, reportController.getPatientReports);
reportRouter.get("/mine", auth, reportController.getMyReports);
reportRouter.get("/byappointment/:appointmentId", auth, reportController.getReportByAppointment);

module.exports = reportRouter;
