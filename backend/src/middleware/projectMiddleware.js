const ApiError = require(
    "../utils/ApiError"
);

const getProjectById = require(
    "../services/projectService"
);

const getOrganizationById = require(
    "../services/organizationService"
);
const asyncHandler = require("../utils/asyncHandler");

// Load Project
const loadProject = asyncHandler(
    async (req, res, next) => {

        const project =
            await getProjectById(
                req.params.projectId
            );

        req.project = project;

        next();
    }
);

// Authorize Project Role
const authorizeProjectRole =
    (...allowedRoles) => {
        return async (
            req,
            res,
            next
        ) => {
            const project = req.project;

            const organization = await getOrganizationById(project.organization);

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

            req.organization =
                organization;

            req.organizationMember =
                member;

            next();
        };
    };

module.exports = { loadProject, authorizeProjectRole };