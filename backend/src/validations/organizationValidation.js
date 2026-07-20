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

exports.updateOrganizationValidation =
    [
        body("name")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Name cannot be empty")
            .isLength({ min: 5, max: 100 })
            .withMessage("Name must be between 5 and 100 characters"),

        body("description")
            .optional()
            .trim()
            .isLength({ max: 1500 })
            .withMessage("Description cannot exceed 1000 characters"),
    ]

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

exports.roleUpdateValidation =
    [
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