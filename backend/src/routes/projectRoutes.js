const express = require("express");

const projectRoutes = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeOrganizationRole = require("../middleware/authorizeOrganizationRole");

const authorizeProjectRole = require("../middleware/authorizeProjectRole");

const validate = require("../middleware/validate");

const { createProjectValidation, updateProjectValidation, updateProjectStatusValidation } = require("../validations/projectValidation");

const { createProject, getProjects, getProject, updateProject, updateProjectStatus, deleteProject, getProjectActivities } = require("../controllers/projectController");

projectRoutes.post(
    "/api/organizations/:organizationId/projects",
    protect,
    authorizeOrganizationRole(
        "org_admin",
        "project_manager"
    ),
    createProjectValidation,
    validate,
    createProject
);

projectRoutes.get(
    "/api/organizations/:organizationId/projects",
    protect,
    authorizeOrganizationRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getProjects
);

projectRoutes.get(
    "/api/projects/:projectId",
    protect,
    authorizeProjectRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getProject
);

projectRoutes.put(
    "/api/projects/:projectId",
    protect,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    updateProjectValidation,
    validate,
    updateProject
);

projectRoutes.patch(
    "/api/projects/:projectId",
    protect,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    updateProjectStatusValidation,
    validate,
    updateProjectStatus
);

projectRoutes.delete(
    "/api/projects/:projectId",
    protect,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    deleteProject
);

projectRoutes.get(
    "/api/projects/:projectId/activities",
    protect,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    getProjectActivities
);

module.exports = projectRoutes;
