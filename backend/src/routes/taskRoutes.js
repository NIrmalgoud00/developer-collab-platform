const express = require("express");

const taskRouter = express.Router();

const protect = require("../middleware/authMiddleware");

const { loadProject, authorizeProjectRole } = require("../middleware/projectMiddleware");

const { loadTask, authorizeTaskRole } = require("../middleware/taskMiddleware");

const validate = require("../middleware/validate");

const { createTaskValidation, updateTaskValidation, assignTaskValidation, moveTaskValidation } = require("../validations/taskValidation");

const { createTask, getTasks, getTask, updateTask, deleteTask, assignTask, moveTask, getTaskActivities } = require("../controllers/taskController");

taskRouter.post(
    "/api/projects/:projectId/tasks",
    protect,
    loadProject,
    authorizeProjectRole(
        "org_admin",
        "project_manager"
    ),
    createTaskValidation,
    validate,
    createTask
);

// GET /projects/:projectId/tasks?status=todo
taskRouter.get(
    "/api/projects/:projectId/tasks",
    protect,
    loadProject,
    authorizeProjectRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getTasks
);

taskRouter.get(
    "/api/tasks/:taskId",
    protect,
    loadTask,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getTask
);

taskRouter.put(
    "/api/tasks/:taskId",
    protect,
    loadTask,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
    ),
    updateTaskValidation,
    validate,
    updateTask
);

taskRouter.delete(
    "/api/tasks/:taskId",
    protect,
    loadTask,
    authorizeTaskRole(
        "org_admin",
        "project_manager"
    ),
    validate,
    deleteTask
);

taskRouter.patch(
    "/api/tasks/:taskId",
    protect,
    loadTask,
    authorizeTaskRole(
        "org_admin",
        "project_manager"
    ),
    assignTaskValidation,
    validate,
    assignTask
);

// PATCH /api/tasks/:taskId/move
taskRouter.patch(
    "/api/tasks/:taskId/move",
    protect,
    loadTask,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
    ),
    moveTaskValidation,
    validate,
    moveTask
);

// GET /api/tasks/:taskId/activities
taskRouter.get(
    "/api/tasks/:taskId/activities",
    protect,
    loadTask,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getTaskActivities
);


module.exports = taskRouter;


















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