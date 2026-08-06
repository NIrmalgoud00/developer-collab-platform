const express = require("express");

const commentRoutes = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeTaskRole = require("../middleware/authorizeTaskRole");

const authorizeOrganizationRole = require("../middleware/authorizeOrganizationRole");

const authorizeRoleAndOwner = require("../middleware/authorizeRoleAndOwner")

const { createCommentValidation, updateCommentValidation } = require("../validations/commentValidation")

const validate = require("../middleware/validate");

const { createComment, getComments, updateComment, deleteComment } = require("../controllers/commentController")

commentRoutes.post(
    "/api/tasks/:taskId/comments",
    protect,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    createCommentValidation,
    validate,
    createComment
);

commentRoutes.get(
    "/api/tasks/:taskId/comments",
    protect,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getComments
);

// Not Required
// commentRoutes.get(
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

commentRoutes.put(
    "/api/comments/:commentId",
    protect,
    authorizeRoleAndOwner(
        "org_admin",
        "project_manager",
        "developer"
    ),
    updateCommentValidation,
    validate,
    updateComment
);

commentRoutes.delete(
    "/api/comments/:commentId",
    protect,
    authorizeRoleAndOwner(
        "org_admin",
        "project_manager",
        "developer"
    ),
    validate,
    deleteComment
);

// db.your_collection_name.updateMany(
//     {},
//     { $set: { new_field_name: "default_value" } }
// );

module.exports = commentRoutes;
