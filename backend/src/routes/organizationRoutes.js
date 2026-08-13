const express =
    require("express");

const organizationRouter =
    express.Router();

const protect =
    require("../middleware/authMiddleware");

const { loadOrganization, authorizeOrganizationRole } =
    require("../middleware/organizationMiddleware");

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
const getOrganizationById = require("../services/organizationService");

// Organization
organizationRouter.post(
    "/",
    protect,
    createOrganizationValidation,
    createOrganization
);

organizationRouter.get(
    "/",
    protect,
    getOrganizations
);

organizationRouter.put(
    "/:organizationId",
    protect,
    loadOrganization,
    authorizeOrganizationRole("org_admin"),
    updateOrganizationValidation,
    updateOrganization
)

organizationRouter.delete(
    "/:organizationId",
    protect,
    loadOrganization,
    authorizeOrganizationRole("org_admin"),
    deleteOrganization
)

// Members
organizationRouter.post(
    "/:organizationId/invite",
    protect,
    loadOrganization,
    authorizeOrganizationRole("org_admin"),
    inviteMemberValidation,
    inviteMember
)

organizationRouter.post(
    "/:organizationId/remove",
    protect,
    loadOrganization,
    authorizeOrganizationRole("org_admin"),
    removeMember
)

organizationRouter.put(
    "/:organizationId/updateMemberRole",
    protect,
    loadOrganization,
    authorizeOrganizationRole("org_admin"),
    roleUpdateValidation,
    memberRoleUpdate
)

// Activity
organizationRouter.get(
    "/:organizationId/activities",
    protect,
    loadOrganization,
    authorizeOrganizationRole("org_admin"),
    getOrganizationActivities
)

module.exports = organizationRouter;