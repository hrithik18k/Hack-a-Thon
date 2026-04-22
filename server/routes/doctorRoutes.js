const express = require("express");
const doctorController = require("../controllers/doctorController");
const { auth, requireRole } = require("../middleware/auth");

const doctorRouter = express.Router();

doctorRouter.get("/getalldoctors", doctorController.getalldoctors);

doctorRouter.get("/getnotdoctors", auth, doctorController.getnotdoctors);

doctorRouter.post("/applyfordoctor", auth, doctorController.applyfordoctor);

doctorRouter.put("/deletedoctor", auth, requireRole("Admin"), doctorController.deletedoctor);

doctorRouter.put("/acceptdoctor", auth, requireRole("Admin"), doctorController.acceptdoctor);

doctorRouter.put("/rejectdoctor", auth, requireRole("Admin"), doctorController.rejectdoctor);

doctorRouter.put("/updateslots", auth, doctorController.updateslots);

module.exports = doctorRouter;
