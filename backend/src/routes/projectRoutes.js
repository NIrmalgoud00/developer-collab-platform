const express = require("express");

const projectRouter = express.Router();

const protect = require("../middleware/authMiddleware");

const { loadOrganization, authorizeOrganizationRole } = require("../middleware/organizationMiddleware");

const { loadProject, authorizeProjectRole } = require("../middleware/projectMiddleware");

const validate = require("../middleware/validate");

const { createProjectValidation, updateProjectValidation, updateProjectStatusValidation } = require("../validations/projectValidation");

const { createProject, getProjects, getProject, updateProject, updateProjectStatus, deleteProject, getProjectActivities } = require("../controllers/projectController");

projectRouter.post(
    "/api/organizations/:organizationId/projects",
    protect,
    loadOrganization,
    authorizeOrganizationRole(
        "org_admin",
        "project_manager"
    ),
    createProjectValidation,
    validate,
    createProject
);

projectRouter.get(
    "/api/organizations/:organizationId/projects",
    protect,
    loadOrganization,
    authorizeOrganizationRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getProjects
);

projectRouter.get(
    "/api/projects/:projectId",
    protect,
    loadProject,
    authorizeProjectRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getProject
);

projectRouter.put(
    "/api/projects/:projectId",
    protect,
    loadProject,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    updateProjectValidation,
    validate,
    updateProject
);

projectRouter.patch(
    "/api/projects/:projectId",
    protect,
    loadProject,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    updateProjectStatusValidation,
    validate,
    updateProjectStatus
);

projectRouter.delete(
    "/api/projects/:projectId",
    protect,
    loadProject,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    deleteProject
);


// Activitives
projectRouter.get(
    "/api/projects/:projectId/activities",
    protect,
    loadProject,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    getProjectActivities
);

module.exports = projectRouter;
