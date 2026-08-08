const ApiError = require(
    "../utils/ApiError"
);

const getOrganizationById = require(
    "../services/organizationService"
);

const getAttachmentById = require(
    "../services/attachmentService"
);

const authorizeAttachmentRoleAndOwner =
    (...allowedRoles) => {
        return async (
            req,
            res,
            next
        ) => {

            const attachment = await getAttachmentById(req.params.attachmentId);
            const organization = await getOrganizationById(attachment.organization);
            const user = req.user

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
                req.attachment = attachment;
                return next();
            }

            // Project Manager
            if (
                member.role === "project_manager" &&
                allowedRoles.includes("project_manager")
            ) {
                req.attachment = attachment;
                return next();
            }

            // Developer
            if (
                member.role === "developer" &&
                allowedRoles.includes("developer")
            ) {
                if (
                    (attachment.uploadedBy.toString() ===
                        user._id.toString())
                ) {
                    req.attachment = attachment;
                    return next();
                }

                return next(
                    new ApiError(
                        403,
                        "You can only manage your own contents"
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

module.exports = authorizeAttachmentRoleAndOwner;