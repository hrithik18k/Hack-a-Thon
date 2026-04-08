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

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.locals, isRead: false }, { isRead: true });
    return res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ success: false, message: "Unable to mark notifications as read" });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.locals, isRead: false });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ success: false, message: "Unable to get unread count" });
  }
};

module.exports = {
  getallnotifs,
  markAllRead,
  getUnreadCount,
};
