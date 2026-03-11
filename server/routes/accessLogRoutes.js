const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  requestAccess,
  getMyAccessLogs,
  getAccessRequests,
  approveAccess,
  denyAccess,
  getAllAccessLogs,
} = require("../controllers/accessLogController");

// Doctor/pharmacist requests access to a patient's record
router.post("/request", auth, requestAccess);

// Patient views all access logs for their own record
router.get("/mine", auth, getMyAccessLogs);

// Doctor/pharmacist views their own outbound access requests
router.get("/requests", auth, getAccessRequests);

// Patient approves a pending access request
router.put("/approve", auth, approveAccess);

// Patient denies a pending access request
router.put("/deny", auth, denyAccess);

// Admin views all access logs in the system
router.get("/all", auth, getAllAccessLogs);

module.exports = router;
