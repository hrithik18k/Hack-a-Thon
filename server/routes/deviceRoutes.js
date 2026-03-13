const express = require("express");
const { auth } = require("../middleware/auth");
const { setMode, getMode, postResult, getResult } = require("../controllers/deviceController");
 
const deviceRouter = express.Router();
 
// Website → set mode (requires auth)
deviceRouter.post("/setmode", auth, setMode);
 
// Frontend → get latest result (requires auth)
deviceRouter.get("/result", auth, getResult);
 
// ESP32 → get current mode (no auth — ESP32 uses a hardcoded API key instead)
deviceRouter.get("/getmode", getMode);
 
// ESP32 → post result back (no auth — ESP32 uses API key)
deviceRouter.post("/result", postResult);
 
module.exports = deviceRouter;