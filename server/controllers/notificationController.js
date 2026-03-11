const Notification = require("../models/notificationModel");

const getallnotifs = async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.locals }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: notifs });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Unable to get all notifications" });
  }
};

module.exports = {
  getallnotifs,
};
