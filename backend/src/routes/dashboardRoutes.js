const express
    = require("express");

const dashboardRouter
    = express.Router();

const protect
    = require("../middleware/authMiddleware");

const {
    loadOrganization,
    authorizeOrganizationRole
} = require("../middleware/organizationMiddleware");

const {
    getDashboard,
} = require("../controllers/dashboardController");

dashboardRouter.get(
    "/",
    protect,
    loadOrganization,
    authorizeOrganizationRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getDashboard
);

module.exports = dashboardRouter;