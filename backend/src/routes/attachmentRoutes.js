const express = require("express");

const attachmentRouter = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeTaskRole = require("../middleware/authorizeTaskRole");
const authorizeAttachmentRoleAndOwner = require("../middleware/authorizeAttachmentRoleAndOwner");

const uploadAttachment = require("../config/attachmentUpload");

const { createAttachment, getAttachments, downloadAttachment, deleteAttachment } = require("../controllers/attachmentController")

attachmentRouter.post(
    "/tasks/:taskId/attachments",
    protect,
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
    downloadAttachment
);

attachmentRouter.delete(
    "/attachments/:attachmentId",
    protect,
    authorizeAttachmentRoleAndOwner(
        "org_admin",
        "project_manager",
        "developer"
    ),
    uploadAttachment.single("file"),
    deleteAttachment
);

module.exports = attachmentRouter;
