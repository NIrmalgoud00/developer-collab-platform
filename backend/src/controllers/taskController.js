const Project = require("../models/Project");

const Organization = require("../models/Organization");

const asyncHandler = require("../utils/asyncHandler");

const ApiError = require("../utils/ApiError");

const getProjectById = require("../services/projectService");

const getTaskById = require("../services/taskService");

const getUserById = require("../services/userService");

const createActivity = require("../services/activityService");

const { ACTIVITY_ACTIONS } = require("../constants/activityActions");

const Task = require("../models/Task");
const Activity = require("../models/Activity");
const { baseGetActivities } = require("../services/baseGetActivities");

exports.createTask =
    asyncHandler(async (req, res) => {

        let project = await getProjectById(req.params.projectId)

        const position =
            await Task.countDocuments({
                project: project._id,
                status: "todo"
            });

        const { title, description, status, priority, assignee, dueDate, labels } = req.body;

        const task =
            await Task.create({
                organization: req.organization._id,
                project: req.project._id,
                title,
                description,
                status,
                priority,
                assignee,
                reporter: req.user._id,
                labels,
                dueDate,
                position,
            });

        await createActivity.logTaskCreated(
            task,
            req.user._id,
        );

        const populatedTask =
            await getTaskById(
                task._id,
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
                        path: "assignee",
                        select: "name email"
                    },
                    {
                        path: "reporter",
                        select: "name email"
                    }
                ]);

        res.status(201).json({
            success: true,
            populatedTask,
        });
    });

exports.getTasks =
    asyncHandler(async (req, res) => {

        const filter = {
            project: req.params.projectId,
            archived: false // not deleted  
        };

        if (req.query.status && req.query.status !== "") {
            filter.status = req.query.status;
        }

        if (req.query.priority && req.query.priority !== "") {
            filter.priority = req.query.priority;
        }

        const tasks =
            await Task.find(filter)
                .populate(
                    "organization",
                    "name"
                )
                .populate(
                    "project",
                    "name"
                )
                .populate(
                    "assignee",
                    "name email"
                )
                .populate(
                    "reporter",
                    "name email"
                )
                .sort({
                    status: 1,
                    position: 1
                });

        res.status(200).json({
            success: true,
            tasks,
        });
    });

exports.getTask =
    asyncHandler(async (req, res) => {

        const task =
            await getTaskById(
                req.task._id,
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
                        path: "assignee",
                        select: "name email"
                    },
                    {
                        path: "reporter",
                        select: "name email"
                    }
                ]);

        res.status(200).json({
            success: true,
            task,
        });
    });

exports.updateTask =
    asyncHandler(async (req, res) => {

        const task = req.task;
        const metadata = {};

        Object.keys(req.body).forEach((key) => {
            const oldValue = task[key];
            const newValue = req.body[key];

            const isChanged =
                oldValue instanceof mongoose.Types.ObjectId
                    ? !oldValue.equals(newValue)
                    : oldValue !== newValue;

            if (isChanged) {
                metadata[key] = {
                    oldValue: task[key],
                    newValue: req.body[key]
                };
            }
        });

        // Nothing changed
        if (Object.keys(metadata).length === 0) {
            return res.status(200).json({
                success: true,
                message: "No changes detected",
                task
            });
        }

        Object.assign(
            task,
            req.body
        ); // Object.assign(terget, source) copy all properties from the source object into the target object.

        await task.save();

        await createActivity.logTaskUpdated(
            task,
            req.user._id,
            metadata
        );

        res.status(200).json({
            success: true,
            message: "Task update successfully",
            task
        });

    })

exports.deleteTask =
    asyncHandler(async (req, res) => {

        const task = req.task;

        task.archived = true;

        await task.save(); // save/change in mongoose memory then mongoose check with DB document if not same or capture updates so update in DB

        await createActivity.logTaskDeleted(
            task,
            req.user._id
        );

        res.status(200).json({
            success: true,
            message: "Task delete successfully",
        });
    });

exports.assignTask =
    asyncHandler(async (req, res) => {

        const task = req.task;

        const user = await getUserById(req.body.userId);

        const member =
            req.organization.members.find(
                (member) =>
                    member.user.toString() ===
                    user._id.toString()
            );

        if (!member) {
            new ApiError(
                403,
                "User is not a member of this organization"
            )
        }

        const previousAssignee = task.assignee;

        task.assignee = user._id;
        await task.save();

        await createActivity.logTaskAssigned(
            task,
            req.user._id,
            user.name,
            previousAssignee // optional
        );

        res.status(200).json({
            success: true,
            message: "User assign successfully",
            task,
        });

    })

exports.moveTask =
    asyncHandler(async (req, res) => {

        const { status, position } = req.body;

        const task = req.task;

        const metadata = {
            status: {
                oldValue: task.status,
                newvalue: status
            },
            position: {
                oldValue: task.position,
                newvalue: position
            }
        }

        task.status = status;
        task.position = position;
        await task.save();

        await createActivity.logTaskMoved(
            task,
            req.user._id,
            metadata
        );

        res.status(200).json({
            success: true,
            task
        });

    })

// GET /api/tasks/:taskId/activities
exports.getTaskActivities =
    asyncHandler(async (req, res) => {

        let action;
        if (req.query.action) {
            action = req.query.action;
        }

        const result = await baseGetActivities(
            // filter
            {
                project: req.params.projectId,
                action,
            },
            {
                page: req.query.page,
                limit: req.query.limit,
                sort: {
                    createdAt: -1,
                },
                populate: [
                    {
                        path: "performedBy",
                        select: "name email",
                    },
                    {
                        path: "task",
                        select: "title",
                    },
                ],
            }
        );

    })