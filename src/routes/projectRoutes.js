const express = require("express");

const projectRoutes = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeOrganizationRole = require("../middleware/authorizeOrganizationRole");

const validate = require("../middleware/validate");

const { createProjectValidation, } = require("../validations/projectValidation");

const { createProject, getProjects, } = require("../controllers/projectController");

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

// create Later
// GET    /api/projects/:projectId
// PUT    /api/projects/:projectId
// DELETE /api/projects/:projectId

module.exports = projectRoutes;
