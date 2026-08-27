const Project = require("../models/Project");
const Task = require("../models/Task");
const Activity = require("../models/Activity");

const ApiError = require("../utils/ApiError");

const getDateRange = (range) => {
    const endDate = new Date();

    const startDate = new Date(endDate);

    switch (range) {
        case "7d":
            startDate.setDate(
                startDate.getDate() - 7
            );
            break;

        case "30d":
            startDate.setDate(
                startDate.getDate() - 30
            );
            break;

        case "90d":
            startDate.setDate(
                startDate.getDate() - 90
            );
            break;

        default:
            throw new ApiError(
                400,
                "Invalid date range. Use 7d, 30d, or 90d"
            );
    }

    return {
        startDate,
        endDate,
    };
};

const getProjectStats = async (organizationId) => {

    const result = await Project.aggregate([
        {
            $match: {
                organization: organizationId,
                archived: false,
            },
        },

        {
            $group: {
                _id: null,

                totalProjects: {
                    $sum: 1,
                },

                activeProjects: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$status",
                                    "active",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
    ]);

    return (
        result[0] || {
            totalProjects: 0,
            activeProjects: 0,
        }
    );
};

const getTaskStats = async (
    organizationId,
    startDate,
    endDate
) => {

    const now = new Date();

    const result = await Task.aggregate([
        {
            $match: {
                organization: organizationId,
                archived: false,
            },
        },

        {
            $group: {
                _id: null,

                totalTasks: {
                    $sum: 1,
                },

                completedTasks: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    {
                                        $eq: [
                                            "$status",
                                            "completed",
                                        ],
                                    },
                                    {
                                        $ne: [
                                            "$completedAt",
                                            null,
                                        ],
                                    },
                                    {
                                        $gte: [
                                            "$completedAt",
                                            startDate,
                                        ],
                                    },
                                    {
                                        $lte: [
                                            "$completedAt",
                                            endDate,
                                        ],
                                    }
                                ],
                            },

                            1,
                            0,
                        ]
                    },
                },

                pendingTasks: {
                    $sum: {
                        $cond: [
                            {
                                $ne: [
                                    "$status",
                                    "completed",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },

                overdueTasks: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    {
                                        $lt: [
                                            "$dueDate",
                                            now,
                                        ],
                                    },
                                    {
                                        $ne: [
                                            "$status",
                                            "completed",
                                        ],
                                    },
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
    ]);

    return (
        result[0] || {
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            overdueTasks: 0,
        }
    );
};

const getTasksByStatus = async (
    organizationId
) => {

    return Task.aggregate([
        {
            $match: {
                organization: organizationId,
                archived: false,
            },
        },

        {
            $group: {
                _id: "$status",

                count: {
                    $sum: 1,
                },
            },
        },

        {
            $project: {
                _id: 0,
                status: "$_id",
                count: 1,
            },
        },

        {
            $sort: {
                count: -1,
            },
        },
    ]);
};

const getTasksByPriority = async (
    organizationId
) => {

    return Task.aggregate([
        {
            $match: {
                organization: organizationId,
                archived: false,
            },
        },

        {
            $group: {
                _id: "$priority",

                count: {
                    $sum: 1,
                },
            },
        },

        {
            $project: {
                _id: 0,
                priority: "$_id",
                count: 1,
            },
        },

        {
            $sort: {
                count: -1,
            },
        },
    ]);
};

const getTasksByAssignee = async (
    organizationId
) => {

    return Task.aggregate([
        {
            $match: {
                organization: organizationId,
                archived: false,

                assignee: {
                    $ne: null,
                },
            },
        },

        {
            $group: {
                _id: "$assignee",

                totalTasks: {
                    $sum: 1,
                },

                completedTasks: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$status",
                                    "completed",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
            },
        },

        {
            $lookup: {
                from: "users",

                localField: "_id",

                foreignField: "_id",

                as: "user",
            },
        },

        {
            $unwind: "$user",
        },

        {
            $project: {
                _id: 0,

                userId: "$user._id",

                name: "$user.name",

                email: "$user.email",

                totalTasks: 1,

                completedTasks: 1,
            },
        },

        {
            $sort: {
                totalTasks: -1,
            },
        },
    ]);
};

// Average time to complete task
const getAverageCompletionTime = async (
    organizationId,
    startDate,
    endDate
) => {

    const result = await Task.aggregate([
        {
            $match: {
                organization: organizationId,

                archived: false,

                status: "completed",

                completedAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },

        {
            $project: {
                completionTime: {
                    $subtract: [
                        "$completedAt",
                        "$createdAt",
                    ],
                },
            },
        },

        {
            $group: {
                _id: null,

                averageCompletionTime: {
                    $avg: "$completionTime",
                },
            },
        },
    ]);

    if (!result.length) {
        return {
            averageCompletionHours: 0,
        };
    }

    return {
        averageCompletionHours:
            Number(
                (
                    result[0]
                        .averageCompletionTime /
                    (1000 * 60 * 60)
                ).toFixed(2)
            ),
    };
};

const getStartOfWeek = () => {

    const date = new Date();

    const day = date.getDay();

    const diff =
        day === 0
            ? 6
            : day - 1;

    date.setDate(
        date.getDate() - diff
    );

    date.setHours(
        0,
        0,
        0,
        0
    );

    return date;
};

const getTasksCompletedThisWeek =
    async (organizationId) => {

        const startOfWeek =
            getStartOfWeek();

        const result =
            await Task.aggregate([
                {
                    $match: {
                        organization:
                            organizationId,

                        archived: false,

                        status: "completed",

                        completedAt: {
                            $gte: startOfWeek,
                        },
                    },
                },

                {
                    $count:
                        "completedThisWeek",
                },
            ]);

        return (
            result[0]
                ?.completedThisWeek || 0
        );
    };

const getMostActiveDevelopers = async (
    organizationId,
    startDate,
    endDate
) => {

    return await Activity.aggregate([
        {
            $match: {
                organization:
                    organizationId,

                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },

        {
            $group: {
                _id: "$performedBy",

                activityCount: {
                    $sum: 1,
                },
            },
        },

        {
            $sort: {
                activityCount: -1,
            },
        },

        {
            $limit: 10,
        },

        {
            $lookup: {
                from: "users",

                localField: "_id",

                foreignField: "_id",

                as: "user",
            },
        },

        {
            $unwind: "$user",
        },

        {
            $project: {
                _id: 0,

                userId: "$user._id",

                name: "$user.name",

                email: "$user.email",

                activityCount: 1,
            },
        },
    ]);
};

const getRecentActivities = async (
    organizationId,
    startDate,
    endDate
) => {

    return Activity.find({
        organization:
            organizationId,

        createdAt: {
            $gte: startDate,
            $lte: endDate,
        },
    })
        .populate("performedBy", "name email")
        .populate("project", "name")
        .populate("task", "title")
        .sort({
            createdAt: -1
        })
        .limit(10)
        .lean();
};

const getDashboard = async ({
    organizationId,
    range,
}) => {

    const { startDate, endDate } =
        getDateRange(range);

    const [
        projectStats,
        taskStats,
        tasksByStatus,
        tasksByPriority,
        tasksByAssignee,
        averageCompletionTime,
        tasksCompletedThisWeek,
        mostActiveDevelopers,
        recentActivity,
    ] = await Promise.all([

        getProjectStats(
            organizationId
        ),

        getTaskStats(
            organizationId,
            startDate,
            endDate
        ),

        getTasksByStatus(
            organizationId
        ),

        getTasksByPriority(
            organizationId
        ),

        getTasksByAssignee(
            organizationId
        ),

        getAverageCompletionTime(
            organizationId,
            startDate,
            endDate
        ),

        getTasksCompletedThisWeek(
            organizationId
        ),

        getMostActiveDevelopers(
            organizationId,
            startDate,
            endDate
        ),

        getRecentActivities(
            organizationId,
            startDate,
            endDate
        ),
    ]);

    return {
        range,

        overview: {
            totalProjects:
                projectStats.totalProjects,

            activeProjects:
                projectStats.activeProjects,

            totalTasks:
                taskStats.totalTasks,

            completedTasks:
                taskStats.completedTasks,

            pendingTasks:
                taskStats.pendingTasks,

            overdueTasks:
                taskStats.overdueTasks,
        },

        tasksByStatus,

        tasksByPriority,

        tasksByAssignee,

        productivity: {
            averageCompletionHours:
                averageCompletionTime
                    .averageCompletionHours,

            completedThisWeek:
                tasksCompletedThisWeek,
        },

        mostActiveDevelopers,

        recentActivity,
    };
};

module.exports = {
    getDashboard,
};