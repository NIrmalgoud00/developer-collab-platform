const Organization = require(
    "../models/Organization"
);

const ApiError = require(
    "../utils/ApiError"
);

const authorizeOrganizationRole =
    (...allowedRoles) => {
        return async (
            req,
            res,
            next
        ) => {
            const organization =
                await Organization.findById(
                    req.params.id
                );

            if (!organization) {
                return next(
                    new ApiError(
                        404,
                        "Organization not found"
                    )
                );
            }

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
                        "Insufficient permissions"
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

module.exports = authorizeOrganizationRole;