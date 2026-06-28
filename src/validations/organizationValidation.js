const { body } = require(
    "express-validator"
);

exports.createOrganizationValidation =
    [
        body("name")
            .trim()
            .notEmpty()
            .withMessage(
                "Organization name is required"
            ),
    ];

exports.inviteMemberValidation =
    [
        body("email")
            .isEmail()
            .withMessage(
                "Valid email required"
            ),

        body("role")
            .isIn([
                "org_admin",
                "project_manager",
                "developer",
            ])
            .withMessage(
                "Invalid role"
            ),
    ];