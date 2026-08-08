const path = require("path");

const asyncHandler = require("../utils/asyncHandler");

const Attachment = require("../models/Attachment")

const createActivity = require("../services/activityService");

const getAttachmentById = require("../services/attachmentService");
const { log } = require("console");

exports.createAttachment = asyncHandler(async (req, res) => {

    if (!req.file) {
        throw new ApiError(400, "Please upload a file");
    }

    const task = req.task;

    const attachment = await Attachment.create({
        organization: task.organization,
        project: task.project,
        task: task._id,

        uploadedBy: req.user._id,

        originalName: req.file.originalname,

        fileName: req.file.filename,

        storagePath: req.file.path,

        mimeType: req.file.mimetype,

        size: req.file.size,
    });

    await createActivity.logUploadFile(
        task,
        req.user._id,
        {
            attachmentId: attachment._id,
            fileName: attachment.originalname,
        }
    )

    const populateAttachment = await getAttachmentById(
        attachment._id,
        [
            {
                path: "uploadedBy",
                select: "name email"
            },
        ]
    )

    res.status(201).json({
        success: true,
        populateAttachment,
    });

});

exports.getAttachments = asyncHandler(async (req, res) => {

    const attachments = await Attachment.find({
        task: req.task._id,
        archived: false,
    })
        .populate(
            "uploadedBy",
            "name email"
        )
        .sort({
            createdAt: -1,
        });

    res.status(200).json({
        success: true,
        count: attachments.length,
        attachments,
    });

});

exports.downloadAttachment = asyncHandler(async (req, res) => {

    const attachment = await getAttachmentById(
        req.params.attachmentId
    );

    return res.download(
        attachment.storagePath,
        attachment.originalName
    );

});

exports.deleteAttachment = asyncHandler(async (req, res) => {

    const attachment = req.attachment;

    attachment.archived = true;

    await attachment.save();

    await createActivity.logDeleteFile(
        attachment,
        req.user._id
    )

    res.status(200).json({
        success: true,
        message: "Attachment deleted successfully",
    });

});

