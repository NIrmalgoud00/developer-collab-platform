const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        index: true
    },

    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
        index: true
    },

    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    mentions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    edited: {
        type: Boolean,
        default: false
    },

    archived: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

commentSchema.index({
    task: 1,
    createdAt: 1
});

module.exports = mongoose.model(
    "Comment",
    commentSchema
);