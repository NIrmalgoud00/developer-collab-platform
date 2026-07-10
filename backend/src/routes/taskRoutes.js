const express = require("express");

const taskRoutes = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeProjectRole = require("../middleware/authorizeProjectRole");

const authorizeTaskRole = require("../middleware/authorizeTaskRole");

const validate = require("../middleware/validate");

const { createTaskValidation, updateTaskValidation, assignTaskValidation, moveTaskValidation } = require("../validations/taskValidation");

const { createTask, getTasks, getTask, updateTask, deleteTask, assignTask, moveTask } = require("../controllers/taskController");

taskRoutes.post(
    "/api/projects/:projectId/tasks",
    protect,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    createTaskValidation,
    validate,
    createTask
);

// GET /projects/:projectId/tasks?status=todo
taskRoutes.get(
    "/api/projects/:projectId/tasks",
    protect,
    authorizeProjectRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getTasks
);

taskRoutes.get(
    "/api/tasks/:taskId",
    protect,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getTask
);

taskRoutes.put(
    "/api/tasks/:taskId",
    protect,
    authorizeTaskRole(
        "org_admin",
        "project_manager"
    ),
    updateTaskValidation,
    validate,
    updateTask
);

taskRoutes.delete(
    "/api/tasks/:taskId",
    protect,
    authorizeTaskRole(
        "org_admin",
        "project_manager"
    ),
    deleteTask
);

taskRoutes.patch(
    "/api/tasks/:taskId",
    protect,
    authorizeTaskRole(
        "org_admin",
        "project_manager"
    ),
    assignTaskValidation,
    validate,
    assignTask
);

// PATCH /api/tasks/:taskId/move
taskRoutes.patch(
    "/api/tasks/:taskId",
    protect,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    moveTaskValidation,
    validate,
    moveTask
);

module.exports = taskRoutes;


















// POST   /api/projects/:projectId/tasks
// GET    /api/projects/:projectId/tasks

// GET    /api/tasks/:taskId
// PUT    /api/tasks/:taskId
// DELETE /api/tasks/:taskId



// Business Logic

// Only

// org_admin
// project_manager

// can create tasks.

// When a task is created:


// project comes from URL
// organization comes from Project
// reporter = logged-in user
// assignee option