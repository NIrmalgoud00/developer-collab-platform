const express =
    require("express");

const organizationRoutes =
    express.Router();

const protect =
    require("../middleware/authMiddleware");

const authorizeOrganizationRole =
    require("../middleware/authorizeOrganizationRole");

const {
    createOrganizationValidation,
    updateOrganizationValidation,
    inviteMemberValidation,
    roleUpdateValidation
} =
    require("../validations/organizationValidation");

const {
    createOrganization,
    getOrganizations,
    updateOrganization,
    deleteOrganization,
    inviteMember,
    removeMember,
    memberRoleUpdate,
    getOrganizationActivities,
} = require(
    "../controllers/organizationController"
);

// Organization
organizationRoutes.post(
    "/",
    protect,
    createOrganizationValidation,
    createOrganization
);

organizationRoutes.get(
    "/",
    protect,
    getOrganizations
);

organizationRoutes.put(
    "/:organizationId",
    protect,
    authorizeOrganizationRole("org_admin"),
    updateOrganizationValidation,
    updateOrganization
)

organizationRoutes.delete(
    "/:organizationId",
    protect,
    authorizeOrganizationRole("org_admin"),
    deleteOrganization
)


// Members
organizationRoutes.post(
    "/:organizationId/invite",
    protect,
    authorizeOrganizationRole("org_admin"),
    inviteMemberValidation,
    inviteMember
)

organizationRoutes.post(
    "/:organizationId/remove",
    protect,
    authorizeOrganizationRole("org_admin"),
    removeMember
)

organizationRoutes.put(
    "/:organizationId/updateMemberRole",
    protect,
    authorizeOrganizationRole("org_admin"),
    roleUpdateValidation,
    memberRoleUpdate
)

// Activity
organizationRoutes.get(
    "/:organizationId/activities",
    protect,
    authorizeOrganizationRole("org_admin"),
    getOrganizationActivities
)

module.exports = organizationRoutes;