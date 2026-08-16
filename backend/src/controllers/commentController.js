const asyncHandler = require("../utils/asyncHandler");

const Comment = require("../models/Comment");

const getCommentById = require("../services/commentService");

const createActivity = require("../services/activityService");

const Activity = require("../models/Activity");

const { createNotification } = require("../services/notificationService");

const NOTIFICATION_TYPES = require("../constants/notificationTypes");

exports.createComment =
    asyncHandler(async (req, res) => {
        const { content, mentions } = req.body;

        const comment =
            await Comment.create({
                organization: req.task.organization,
                project: req.task.project,
                task: req.task._id,
                createBy: req.user._id,
                content,
                mentions
            });

        for (const userId of mentions) {

            if (
                req.user._id.equals(userId)
            ) {
                continue;
            }

            await createNotification({
                recipient: userId,
                organization: req.task.organization,
                type: NOTIFICATION_TYPES.COMMENT_MENTION,
                actor: req.user._id,
                entityType: "Comment",
                entityId: comment._id,
                metadata: {
                    taskTitle: req.task.title,
                    taskId: req.task._id
                }
            });
        }

        await createActivity.logCommentCreated(
            comment,
            req.user._id,
        );

        const populatedComment =
            await getCommentById(
                comment._id,
                [
                    {
                        path: "organization",
                        select: "name"
                    },
                    {
                        path: "project",
                        select: "name"
                    },
                    {
                        path: "task",
                        select: "title"
                    },
                    {
                        path: "createBy",
                        select: "name email"
                    }
                ]);

        res.status(201).json({
            success: true,
            populatedComment,
        });
    })

exports.getComments =
    asyncHandler(async (req, res) => {

        const filter = {
            task: req.task._id,
            archived: false // not deleted  
        };

        const comments =
            await Comment.find(filter)
                .populate(
                    "organization",
                    "name"
                )
                .populate(
                    "project",
                    "name"
                )
                .populate(
                    "task",
                    "name"
                )
                .populate(
                    "createBy",
                    "name email"
                );

        res.status(200).json({
            success: true,
            comments,
        });
    });

exports.updateComment =
    asyncHandler(async (req, res) => {

        const { content, mentions = [] } = req.body;

        const oldMentions = req.comment.mentions || [];
        const newMentions = mentions || [];

        // Array to Set
        const oldMentionIds = new Set(
            oldMentions.map((id) => id.toString())
        );

        const newMentionIds = new Set(
            newMentions.map((id) => id.toString())
        );

        // Check content change
        const contentChanged =
            req.comment.content !== content;

        // Check mentions change
        const mentionsChanged =
            oldMentionIds.size !== newMentionIds.size ||
            [...oldMentionIds].some(
                (id) => !newMentionIds.has(id)
            );

        if (!contentChanged && !mentionsChanged) {
            return res.status(200).json({
                success: true,
                message: "No changes detected",
                comment: req.comment
            });
        }

        const metadata = {};

        // Content changed
        if (contentChanged) {
            metadata.content = {
                oldValue: req.comment.content,
                newValue: content
            };

            req.comment.content = content;
            req.comment.edited = true;
        }

        // Mentions changed
        if (mentionsChanged) {
            metadata.mentions = {
                oldValue: oldMentions,
                newValue: newMentions
            };

            req.comment.mentions = newMentions;
        }

        await req.comment.save();

        // Find only newly mentioned users
        const newlyMentionedUsers =
            newMentions.filter(
                (userId) =>
                    !oldMentionIds.has(userId.toString())
            );

        // Create notifications only for new mentions
        for (const userId of newlyMentionedUsers) {

            // Don't notify yourself
            if (
                req.user._id.equals(userId)
            ) {
                continue;
            }

            await createNotification({
                recipient: userId,

                organization:
                    req.organization._id,

                type:
                    NOTIFICATION_TYPES.COMMENT_MENTION,

                actor:
                    req.user._id,

                entityType: "Comment",

                entityId:
                    req.comment._id,

                metadata: {
                    taskTitle: req.task.title,
                    taskId: req.task._id
                }
            });
        }


        await createActivity.logCommentUpdated(
            req.comment,
            req.user._id,
            metadata
        );


        const populatedComment =
            await getCommentById(
                req.comment._id,
                [
                    {
                        path: "organization",
                        select: "name"
                    },
                    {
                        path: "project",
                        select: "name"
                    },
                    {
                        path: "task",
                        select: "title"
                    },
                    {
                        path: "createBy",
                        select: "name email"
                    }
                ]
            );


        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            populatedComment
        });
    });

exports.deleteComment =
    asyncHandler(async (req, res) => {

        const comment = req.comment;

        comment.archived = true;

        await comment.save(); // save/change in mongoose memory then mongoose check with DB document if not same or capture updates so update in DB

        await createActivity.logCommentDeleted(
            comment,
            req.user._id
        );

        res.status(200).json({
            success: true,
            message: "Comment delete successfully",
        });
    });

