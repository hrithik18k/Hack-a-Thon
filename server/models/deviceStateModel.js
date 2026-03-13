const mongoose = require("mongoose");
 
const deviceStateSchema = new mongoose.Schema(
  {
    // Only one document ever exists (singleton pattern)
    // We use a fixed key "main" to always find/upsert it
    key: { type: String, default: "main", unique: true },
 
    // "idle" | "enroll" | "scan"
    mode: { type: String, default: "idle" },
 
    // When mode = "enroll", this is the userId of the patient enrolling
    enrollUserId: { type: String, default: null },
 
    // Latest result pushed by the ESP32
    // { status: "found" | "not_found" | "enrolled", templateId, timestamp }
    result: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("DeviceState", deviceStateSchema);