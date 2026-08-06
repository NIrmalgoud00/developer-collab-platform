const ApiError = require(
    "../utils/ApiError"
);

const getOrganizationById = require(
    "../services/organizationService"
);

const getUserById = require(
    "../services/userService"
);

const getCommentById = require(
    "../services/commentService"
);

const authorizeRoleAndOwner =
    (...allowedRoles) => {
        return async (
            req,
            res,
            next
        ) => {

            const comment = await getCommentById(req.params.commentId);
            const organization = await getOrganizationById(comment.organization);
            const user = await getUserById(req.user._id);

            const member =
                organization.members.find(
                    (member) =>
                        member.user.toString() ===
                        user._id.toString()
                );

            if (!member) {
                new ApiError(
                    403,
                    "User is not a member of this organization"
                )
            }

            // Org Admin
            if (
                member.role === "org_admin" &&
                allowedRoles.includes("org_admin")
            ) {
                req.comment = comment;
                return next();
            }

            // Project Manager
            if (
                member.role === "project_manager" &&
                allowedRoles.includes("project_manager")
            ) {
                req.comment = comment;
                return next();
            }

            // Developer
            if (
                member.role === "developer" &&
                allowedRoles.includes("developer")
            ) {
                if (
                    (comment.createBy.toString() ===
                        user._id.toString())
                ) {
                    req.comment = comment;
                    return next();
                }

                return next(
                    new ApiError(
                        403,
                        "You can only manage your own comments"
                    )
                );
            }

            return next(
                new ApiError(
                    403,
                    "Access denied"
                )
            );

        }
    }

module.exports = authorizeRoleAndOwner;