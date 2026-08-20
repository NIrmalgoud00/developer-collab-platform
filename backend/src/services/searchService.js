const ApiError = require("../utils/ApiError")

const asyncHandler = require("../utils/asyncHandler")

const Task = require("../models/Task");

const Comment = require("../models/Comment");

const searchTasks = async ({
    organizationId,
    query,
    page = 1,
    limit = 20,
}) => {
    const skip = (page - 1) * limit;

    const filter = {
        organization: organizationId,
        archived: false,
        $text: {
            $search: query,
        },
    };

    const [tasks, total] = await Promise.all([
        Task.find(filter)
            .select(
                "title description status priority assignee project createdAt"
            )
            .populate("assignee", "name email")
            .populate("project", "name")
            .sort({
                score: {
                    $meta: "textScore",
                },
            })
            .skip(skip)
            .limit(limit),

        Task.countDocuments(filter),
    ]);

    return {
        tasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

const searchComments = async ({
    organizationId,
    query,
    page = 1,
    limit = 20,
}) => {
    const skip = (page - 1) * limit;

    const filter = {
        organization: organizationId,
        content: {
            $regex: query,
            $options: "i",
        },
    };

    const [comments, total] = await Promise.all([
        Comment.find(filter)
            .populate("createBy", "name email")
            .populate("task", "title")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Comment.countDocuments(filter),
    ]);

    return {
        comments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

exports.search = async ({
    organizationId,
    query,
    type = "task",
    page = 1,
    limit = 20,
}) => {

    let results;

    if (type === "task") {

        results = await searchTasks({
            organizationId,
            query,
            page,
            limit,
        });

    } else if (type === "comment") {

        results = await searchComments({
            organizationId,
            query,
            page,
            limit,
        });

    } else {

        throw new ApiError(
            400,
            "Invalid search type"
        );
    }

    return results;
};