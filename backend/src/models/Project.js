const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "planning",
                "active",
                "completed",
            ],
            default: "planning",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        archived: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

// Additional indexes
projectSchema.index({ organization: 1, createdAt: -1 });
projectSchema.index({ organization: 1, status: 1 });

module.exports = mongoose.model(
    "Project",
    projectSchema
);