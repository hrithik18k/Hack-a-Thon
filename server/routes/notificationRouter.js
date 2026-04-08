const express = require("express");
const { auth } = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");

const notificationRouter = express.Router();

notificationRouter.get(
  "/getallnotifs",
  auth,
  notificationController.getallnotifs
);

notificationRouter.get(
  "/unreadcount",
  auth,
  notificationController.getUnreadCount
);

notificationRouter.put(
  "/markallread",
  auth,
  notificationController.markAllRead
);

module.exports = notificationRouter;
