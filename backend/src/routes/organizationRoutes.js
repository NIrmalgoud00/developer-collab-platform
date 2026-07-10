const express = require("express");

const organizationRoutes = express.Router();

const protect = require(
    "../middleware/authMiddleware"
);

const authorizeOrganizationRole = require("../middleware/authorizeOrganizationRole")

const {
    createOrganization,
    getOrganizations,
    inviteMember,
} = require(
    "../controllers/organizationController"
);

organizationRoutes.post(
    "/",
    protect,
    createOrganization
);

organizationRoutes.get(
    "/",
    protect,
    getOrganizations
);

organizationRoutes.post(
    "/:id/invite",
    protect,
    authorizeOrganizationRole("org_admin"),
    inviteMember
)

module.exports = organizationRoutes;