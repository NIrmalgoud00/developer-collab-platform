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
                "completed"
            ],
            default: "todo"
        },

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high",
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

        completedAt: {
            type: Date,
            default: null,
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

// Add new indexes
taskSchema.index({
    organization: 1,
    status: 1
});

taskSchema.index({
    organization: 1,
    priority: 1
});

taskSchema.index({
    organization: 1,
    assignee: 1
});

taskSchema.index({
    organization: 1,
    dueDate: 1
});

taskSchema.index({
    organization: 1,
    completedAt: 1
});

module.exports = mongoose.model(
    "Task",
    taskSchema
);