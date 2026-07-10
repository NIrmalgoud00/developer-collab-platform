const express = require("express");

const projectRoutes = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeOrganizationRole = require("../middleware/authorizeOrganizationRole");

const authorizeProjectRole = require("../middleware/authorizeProjectRole");

const validate = require("../middleware/validate");

const { createProjectValidation, updateProjectValidation } = require("../validations/projectValidation");

const { createProject, getProjects, getProject, updateProject, deleteProject } = require("../controllers/projectController");

projectRoutes.post(
    "/api/organizations/:id/projects",
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
    "/api/organizations/:id/projects",
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

projectRoutes.delete(
    "/api/projects/:projectId",
    protect,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    deleteProject
);

module.exports = projectRoutes;
