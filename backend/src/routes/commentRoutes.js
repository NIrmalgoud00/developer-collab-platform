const express = require("express");

const commentRouter = express.Router();

const protect = require("../middleware/authMiddleware");

const { loadTask, authorizeTaskRole } = require("../middleware/taskMiddleware");

const { loadComment, authorizeOwnership } = require("../middleware/authorizeOwnership")

const { createCommentValidation, updateCommentValidation } = require("../validations/commentValidation")

const validate = require("../middleware/validate");

const { createComment, getComments, updateComment, deleteComment } = require("../controllers/commentController")

commentRouter.post(
    "/api/tasks/:taskId/comments",
    protect,
    loadTask,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    createCommentValidation,
    validate,
    createComment
);

commentRouter.get(
    "/api/tasks/:taskId/comments",
    protect,
    loadTask,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    validate,
    getComments
);

// Not Required
// commentRouter.get(
//     "/api/comments/:commentId",
//     protect,
//     authorizeTaskRole(
//         "org_admin",
//         "project_manager",
//         "developer"
//     ),
//     getComment
// );

// PUT / api / comments /: commentId

commentRouter.put(
    "/api/comments/:commentId",
    protect,
    loadComment,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    authorizeOwnership(),
    updateCommentValidation,
    validate,
    updateComment
);

commentRouter.delete(
    "/api/comments/:commentId",
    protect,
    loadComment,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    authorizeOwnership(),
    validate,
    deleteComment
);

module.exports = commentRouter;
