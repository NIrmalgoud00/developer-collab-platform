const ApiError = require(
    "../utils/ApiError"
);

const getOrganizationById = require(
    "../services/organizationService"
);

const getTaskById = require(
    "../services/taskService"
);

const authorizeTaskRole =
    (...allowedRoles) => {
        return async (
            req,
            res,
            next
        ) => {
            const task = await getTaskById(req.params.taskId);

            const organization = await getOrganizationById(task.organization);

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

            req.task =
                task;

            req.organization =
                organization;

            req.organizationMember =
                member;

            next();
        };
    };

module.exports = authorizeTaskRole;