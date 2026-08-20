const asyncHandler =
    require("../utils/asyncHandler")

const ApiError = require("../utils/ApiError")

const searchService = require("../services/searchService");

exports.getSearchTasks = asyncHandler(async (req, res) => {
    const {
        q,
        type = "task",
        page = 1,
        limit = 20,
    } = req.query;

    if (!q || !q.trim()) {
        throw new ApiError(
            400,
            "Search query is required"
        );
    }

    const result = await searchService.search({
        organizationId: req.organization._id,
        query: q.trim(),
        type,
        page: Number(page),
        limit: Number(limit),
    });

    res.status(200).json({
        success: true,
        type,
        ...result,
    });
});