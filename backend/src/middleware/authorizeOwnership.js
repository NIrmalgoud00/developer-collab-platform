const ApiError = require(
    "../utils/ApiError"
);

const getCommentById = require(
    "../services/commentService"
);

const getTaskById = require(
    "../services/taskService"
);

const getAttachmentById = require(
    "../services/attachmentService"
)

const asyncHandler = require("../utils/asyncHandler");
const Attachment = require("../models/Attachment");

// Load Comment
const loadComment = asyncHandler(
    async (req, res, next) => {

        const comment =
            await getCommentById(
                req.params.commentId,
                ["task"]
            );

        req.task = comment.task;
        req.comment = comment;

        next();
    }
);

// Load Attachment
const loadAttachment = asyncHandler(
    async (req, res, next) => {
        const attachment = await Attachment.findOne({
            _id: req.params.attachmentId,
            archived: false,
        })
            .populate("task")
            .populate(
                "uploadedBy",
                "name email"
            )
            .sort({
                createdAt: -1,
            });

        if (!attachment) {
            throw new ApiError(404, "Attachment not found");
        }

        req.task = attachment.task;
        req.attachment = attachment;

        next();
    }
);
// Authorize Owner
const authorizeOwnership = () => {
    return async (
        req,
        res,
        next
    ) => {

        const comment = req.comment;
        const attachment = req.attachment;

        // Org Admin
        if (req.organizationMember.role === "org_admin") {
            return next();
        }

        // Project Manager
        if (req.organizationMember.role === "project_manager") {
            return next();
        }

        // Developer
        if (comment) {
            if (req.organizationMember.role === "developer") {
                if (req.comment.createBy.equals(req.user._id)) {
                    return next();
                }

                return next(
                    new ApiError(
                        403,
                        "You can only manage your own comments"
                    )
                );
            }
        }

        if (attachment) {
            if (req.organizationMember.role === "developer") {
                if (req.attachment.uploadedBy.equals(req.user._id)) {
                    return next();
                }

                return next(
                    new ApiError(
                        403,
                        "You can only manage your own attachments"
                    )
                );
            }
        }

        return next(
            new ApiError(
                403,
                "Access denied"
            )
        );

    }
}

module.exports = { loadComment, loadAttachment, authorizeOwnership };