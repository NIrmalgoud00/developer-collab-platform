const ApiError = require(
    "../utils/ApiError"
);

const getOrganizationById = require(
    "../services/organizationService"
);

const getProjectById = require(
    "../services/projectService"
);

const authorizeProjectRole =
    (...allowedRoles) => {
        return async (
            req,
            res,
            next
        ) => {
            const project = await getProjectById(req.params.projectId);

            const organization = await getOrganizationById(project.organization);

            const member =
                organization.members.find(
                    (member) =>
                        member.user.toString() ===
                        req.user._id.toString()
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

module.exports = authorizeProjectRole;