const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
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
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "todo",
                "in_progress",
                "review",
                "done"
            ],
            default: "todo"
        },

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high",
                "critical"
            ],
            default: "medium"
        },

        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        labels: [
            {
                type: String
            }
        ],

        dueDate: {
            type: Date
        },

        position: {
            type: Number,
            default: 0
        },

        archived: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);

taskSchema.index({
    title: "text",
    description: "text",
});

taskSchema.index({
    project: 1,
    status: 1,
    position: 1
});

taskSchema.index({
    assignee: 1,
    status: 1
});

taskSchema.index({
    dueDate: 1
});

module.exports = mongoose.model(
    "Task",
    taskSchema
);