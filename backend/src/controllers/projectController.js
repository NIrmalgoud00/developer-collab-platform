const Project = require("../models/Project");
const Organization = require("../models/Organization");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const getProjectById = require("../services/projectService");
const { baseGetActivities } = require("../services/baseGetActivities");

const createActivity
  = require("../services/activityService");

exports.createProject =
  asyncHandler(async (req, res) => {
    const { name, description } =
      req.body;

    const project =
      await Project.create({
        organization: req.organization._id,
        name,
        description,
        createdBy: req.user._id,
      });

    const populatedProject =
      await getProjectById(
        project._id,
        [
          {
            path: "organization",
            select: "name"
          },
          {
            path: "createdBy",
            select: "name email"
          }
        ]
      )

    await createActivity.logProjectCreated(
      project,
      req.user._id
    )

    res.status(201).json({
      success: true,
      populatedProject,
    });
  });

exports.getProjects =
  asyncHandler(async (req, res) => {

    // console.log(" req.params.organizationId", req.params.id);

    const projects =
      await Project.find({ organization: req.organization._id, archived: false })
        .populate("organization", "name")
        .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      projects,
    });
  });

exports.getProject =
  asyncHandler(async (req, res) => {

    const project =
      await getProjectById(
        req.params.projectId,
        [
          {
            path: "organization",
            select: "name"
          },
          {
            path: "createdBy",
            select: "name email"
          }
        ]
      )

    res.status(200).json({
      success: true,
      project,
    });
  });


exports.updateProject =
  asyncHandler(async (req, res) => {

    let metadata = {};

    Object.keys(req.body).forEach((key) => {
      if (req.project[key] !== req.body[key]) {
        metadata[key] = {
          oldValue: req.project[key],
          newValue: req.body[key]
        };
      }
    });

    Object.assign(
      req.project,
      req.body
    );

    req.project.save();

    await createActivity.logProjectUpdated(
      req.project,
      req.user._id,
      metadata
    )

    res.status(200).json({
      success: true,
      project: req.project,
    });
  });

exports.updateProjectStatus =
  asyncHandler(async (req, res) => {

    const newStatus = req.body.status;

    const oldStatus = req.project.status;

    req.project.status = newStatus;

    req.project.save();

    createActivity.logProjectStatusChange(
      req.project,
      req.user._id,
      oldStatus,
      newStatus
    );

    res.status(201).json({
      success: true,
      project: req.project,
    });
  });


exports.deleteProject =
  asyncHandler(async (req, res) => {

    req.project.archived = true;
    req.project.save();

    await createActivity.logProjectDeleted(
      req.project,
      req.user._id
    )

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  });

exports.getProjectActivities =
  asyncHandler(async (req, res) => {

    let action;
    if (req.query.action) {
      action = req.query.action;
    }

    const result = await baseGetActivities(
      // filter
      {
        project: req.params.projectId,
        action
      },
      // {
      //   page: req.query.page,
      //   limit: req.query.limit,
      //   sort: {
      //     createdAt: -1,
      //   },
      //   populate: [
      //     {
      //       path: "performedBy",
      //       select: "name email",
      //     },
      //     {
      //       path: "task",
      //       select: "title",
      //     },
      //   ],
      // }
    );

  })