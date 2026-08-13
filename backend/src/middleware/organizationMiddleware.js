const ApiError = require(
    "../utils/ApiError"
);

const getOrganizationById = require(
    "../services/organizationService"
);
const asyncHandler = require("../utils/asyncHandler");

// Load Organization
const loadOrganization = asyncHandler(
    async (req, res, next) => {

        const organization =
            await getOrganizationById(
                req.params.organizationId
            );

        req.organization = organization;

        next();
    }
);

// Authorize Organization Role
const authorizeOrganizationRole =
    (...allowedRoles) => {
        return async (
            req,
            res,
            next
        ) => {

            const organization = req.organization;

            const member =
                organization.members.find(
                    (member) => member.user.equals(req.user._id)
                );

            if (!member) {
                return next(
                    new ApiError(
                        403,
                        "You are not Owner of this organization"
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

            req.organizationMember =
                member;

            next();
        };
    };

module.exports = {
    loadOrganization,
    authorizeOrganizationRole
};