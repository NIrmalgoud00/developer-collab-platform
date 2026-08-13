const express = require("express");

const attachmentRouter = express.Router();

const protect = require("../middleware/authMiddleware");

const { loadTask, authorizeTaskRole } = require("../middleware/taskMiddleware");
const { loadAttachment, authorizeOwnership } = require("../middleware/authorizeOwnership");

const uploadAttachment = require("../config/attachmentUpload");

const { createAttachment, getAttachments, downloadAttachment, deleteAttachment } = require("../controllers/attachmentController");

attachmentRouter.post(
    "/tasks/:taskId/attachments",
    protect,
    loadTask,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    uploadAttachment.single("file"),
    createAttachment
);

attachmentRouter.get(
    "/tasks/:taskId/attachments",
    protect,
    loadTask,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    getAttachments
);

attachmentRouter.get(
    "/attachments/:attachmentId/download",
    protect,
    loadAttachment,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    downloadAttachment
);

attachmentRouter.delete(
    "/attachments/:attachmentId",
    protect,
    loadAttachment,
    authorizeTaskRole(
        "org_admin",
        "project_manager",
        "developer"
    ),
    authorizeOwnership(),
    uploadAttachment.single("file"),
    deleteAttachment
);

module.exports = attachmentRouter;
