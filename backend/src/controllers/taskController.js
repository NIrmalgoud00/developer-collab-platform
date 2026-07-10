const Project = require("../models/Project");

const Organization = require("../models/Organization");

const asyncHandler = require("../utils/asyncHandler");

const ApiError = require("../utils/ApiError");

const getProjectById = require("../services/projectService");

const getTaskById = require("../services/taskService");

const getUserById = require("../services/userService");

const Task = require("../models/Task");

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

        const populatedTask =
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

        Object.assign(
            req.task,
            req.body
        ); // Object.assign(terget, source) copy all properties from the source object into the target object.

        await req.task.save();

        res.status(200).json({
            success: true,
            task: req.task
        });

    })

exports.deleteTask =
    asyncHandler(async (req, res) => {
        req.task.archived = true;

        await req.task.save(); // save/change in mongoose memory then mongoose check with DB document if not same or capture updates so update in DB

        res.status(200).json({
            success: true,
            message: "Task delete successfully",
        });
    });

exports.assignTask =
    asyncHandler(async (req, res) => {

        const user = await getUserById(req.body.userId);

        const member =
            req.organization.members.find(
                (member) =>
                    member.user.toString() ===
                    user._id.toString()
            );

        if (!member) {
            return next(
                new ApiError(
                    403,
                    "User is not a member of this organization"
                )
            );
        }

        req.task.assignee = user._id;
        await req.task.save();

        res.status(200).json({
            success: true,
            message: "User assign successfully",
            task: req.task,
        });

    })

// Business Rules
//       Task must exist
//       User must exist
//       User must belong to the same organization
//       Only org_admin and project_manager can assign tasks
//       Assigned user can be changed
//       Save activity log (later)

exports.moveTask =
    asyncHandler(async (req, res) => {

        const { status, position } = req.body;

        req.task.status = status;
        req.task.position = position;
        await req.task.save();

        res.status(200).json({
            success: true,
            task: req.task,
        });

    })

// Business Rules
//      Status must be valid
//      Position must be valid
//      Update ordering
//      Save activity
//      Send notification (later)