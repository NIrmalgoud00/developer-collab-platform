const asyncHandler = require("../utils/asyncHandler");

const Comment = require("../models/Comment")

const getCommentById = require("../services/commentService")

const createActivity = require("../services/activityService")

const Activity = require("../models/Activity")

exports.createComment =
    asyncHandler(async (req, res) => {
        const { content } = req.body;

        const comment =
            await Comment.create({
                organization: req.task.organization,
                project: req.task.project,
                task: req.task._id,
                createBy: req.user._id,
                content
            });

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
            task: req.params.taskId,
            archived: false // not deleted  
        };

        // if (req.query.status && req.query.status !== "") {
        //     filter.status = req.query.status;
        // }

        // if (req.query.priority && req.query.priority !== "") {
        //     filter.priority = req.query.priority;
        // }

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
        const comment = req.comment;
        const { content } = req.body;

        if (comment.content === content) {
            return res.status(200).json({
                success: true,
                message: "No changes detected",
                comment
            });
        }

        const metadata = {
            content: {
                oldValue: comment.content,
                newValue: content
            }
        };

        comment.content = content;
        comment.edited = true;

        await comment.save();

        await createActivity.logCommentUpdated(
            comment,
            req.user._id,
            metadata
        );

        res.status(200).json({
            success: true,
            message: "Comment update successfully",
            comment
        });
    })


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

