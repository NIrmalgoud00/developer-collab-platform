const express = require("express");

const NotificationRouter = express.Router();

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

const protect =
    require("../middleware/authMiddleware");


// All notification routes require authentication
NotificationRouter.use(protect);

// Get notifications
NotificationRouter.get(
    "/",
    getNotifications
);


// Get unread notification count
NotificationRouter.get(
    "/unread-count",
    getUnreadCount
);


// Mark all notifications as read
NotificationRouter.patch(
    "/read-all",
    markAllAsRead
);


// Mark one notification as read
NotificationRouter.patch(
    "/:notificationId/read",
    markAsRead
);


module.exports = NotificationRouter;