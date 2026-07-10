const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            enum: [
                "org_admin",
                "project_manager",
                "developer",
            ],
            default: "developer",
        },
    },
    {
        _id: false,
    }
);

const organizationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        members: [memberSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Organization",
    organizationSchema
);