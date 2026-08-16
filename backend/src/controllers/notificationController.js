const asyncHandler = require("../utils/asyncHandler");
const notificationService = require("../services/notificationService");


// GET /api/notifications?page=1&limit=20
exports.getNotifications = asyncHandler(
    async (req, res) => {
        const filter = {
            recipient: req.user._id,
        };

        if (req.query.isRead !== undefined) {
            filter.isRead = req.query.isRead === "true";
        }

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 20;

        // Pagination validation
        page = Math.max(page, 1);
        limit = Math.min(Math.max(limit, 1), 100);

        const result =
            await notificationService.getNotifications(
                filter,
                page,
                limit
            );

        return res.status(200).json({
            success: true,
            ...result
        });
    }
);


// GET /api/notifications/unread-count
exports.getUnreadCount = asyncHandler(
    async (req, res) => {

        const count =
            await notificationService.getUnreadCount(
                req.user._id
            );

        return res.status(200).json({
            success: true,
            count
        });
    }
);


// PATCH /api/notifications/:notificationId/read
exports.markAsRead = asyncHandler(
    async (req, res) => {

        const notification =
            await notificationService.markAsRead(
                req.params.notificationId,
                req.user._id
            );

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });
    }
);


// PATCH /api/notifications/read-all
exports.markAllAsRead = asyncHandler(
    async (req, res) => {

        const result =
            await notificationService.markAllAsRead(
                req.user._id
            );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            modifiedCount: result.modifiedCount
        });
    }
);