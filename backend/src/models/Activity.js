const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null,
            index: true
        },

        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
            index: true
        },

        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
            index: true
        },

        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        action: {
            type: String,
            required: true
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }

    },
    {
        timestamps: true
    });

activitySchema.index({
    task: 1,
    createdAt: -1
});

activitySchema.index({
    organization: 1,
    createdAt: -1
});

module.exports =
    mongoose.model(
        "Activity",
        activitySchema
    );