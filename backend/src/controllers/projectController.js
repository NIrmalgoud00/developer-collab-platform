const Project = require("../models/Project");
const Organization = require("../models/Organization");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const getProjectById = require("../services/projectService");

// change
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

    // const populatedProject = await Project.findById(project._id)
    //   .populate("organization", "name")
    //   .populate("createdBy", "name email");

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

    res.status(201).json({
      success: true,
      populatedProject,
    });
  });

exports.getProjects =
  asyncHandler(async (req, res) => {

    // console.log(" req.params.organizationId", req.params.id);

    const projects =
      await Project.find({ organization: req.organization._id })
        .populate("organization", "name")
        .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      projects,
    });
  });


// change
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
    const project =
      await Project.findById(
        req.params.projectId
      );

    if (!project) {
      throw new ApiError(
        404,
        "Project not found"
      );
    }

    const updatedProject =
      await Project.findByIdAndUpdate(
        req.params.projectId,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      project: updatedProject,
    });
  });


exports.deleteProject =
  asyncHandler(async (req, res) => {
    const project =
      await Project.findById(
        req.params.projectId
      );

    if (!project) {
      throw new ApiError(
        404,
        "Project not found"
      );
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  });