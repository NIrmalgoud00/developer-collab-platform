const Notification = require("../models/Notification");

const ApiError = require("../utils/ApiError")

const createNotification = async ({
    recipient,
    organization,
    type,
    actor,
    entityType,
    entityId,
    metadata = {},
}) => {
    return Notification.create({
        recipient,
        organization,
        type,
        actor,
        entityType,
        entityId,
        metadata,
    });
};

const getNotifications = async (filter, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
        Notification.find(filter)
            .populate("actor", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Notification.countDocuments(filter)
    ]);

    return {
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};


const getUnreadCount = async (userId) => {

    return Notification.countDocuments({
        recipient: userId,
        isRead: false
    });

};


const markAsRead = async (
    notificationId,
    userId
) => {

    const notification =
        await Notification.findOne({
            _id: notificationId,
            recipient: userId
        });

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    if (!notification.isRead) {

        notification.isRead = true;
        notification.readAt = new Date();

        await notification.save();
    }

    return notification;
};


const markAllAsRead = async (userId) => {

    const result =
        await Notification.updateMany(
            {
                recipient: userId,
                isRead: false
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date()
                }
            }
        );

    return result;
};


module.exports = {
    createNotification,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};