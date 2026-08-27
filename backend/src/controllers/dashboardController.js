const asyncHandler = require("../utils/asyncHandler");

const {
    getDashboard,
} = require("../services/dashboardService.js");

const getDashboardController = asyncHandler(
    async (req, res) => {

        const organizationId =
            req.organization._id;

        const { range = "30d" } =
            req.query;

        const dashboard =
            await getDashboard({
                organizationId,
                range
            });

        res.status(200).json({
            success: true,
            data: dashboard,
        });
    }
);

module.exports = {
    getDashboard:
        getDashboardController,
};