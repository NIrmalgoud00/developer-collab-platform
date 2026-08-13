const ApiError = require(
    "../utils/ApiError"
);

const getTaskById = require(
    "../services/taskService"
);

const getOrganizationById = require(
    "../services/organizationService"
);

const getProjectById = require(
    "../services/projectService"
);

const asyncHandler = require("../utils/asyncHandler");

// Load Task
const loadTask = asyncHandler(
    async (req, res, next) => {

        const task =
            await getTaskById(
                req.params.taskId
            );

        req.task = task;

        next();
    }
);

// Authorize Task Role
const authorizeTaskRole =
    (...allowedRoles) => {
        return async (
            req,
            res,
            next
        ) => {
            const task = req.task;

            const organization = await getOrganizationById(task.organization);
            const project = await getProjectById(task.project);

            const member =
                organization.members.find(
                    (member) => member.user.equals(req.user._id)
                );

            if (!member) {
                return next(
                    new ApiError(
                        403,
                        "You are not a member of this organization"
                    )
                );
            }

            if (
                !allowedRoles.includes(
                    member.role
                )
            ) {
                return next(
                    new ApiError(
                        403,
                        "Access denied"
                    )
                );
            }

            req.project =
                project;

            req.organization =
                organization;

            req.organizationMember =
                member;

            next();
        };
    };

module.exports = { loadTask, authorizeTaskRole };