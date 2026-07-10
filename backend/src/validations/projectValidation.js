const { body } = require(
    "express-validator"
);

const createProjectValidation =
    [
        body("name")
            .trim()
            .notEmpty()
            .withMessage(
                "Project name is required"
            )
            .isLength({ min: 3 })
            .withMessage(
                "Project name must be at least 3 characters"
            ),
    ];

const updateProjectValidation = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be between 3 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("status")
        .optional()
        .isIn([
            "planning",
            "active",
            "completed",
            "archived"
        ])
        .withMessage("Invalid status"),
];

module.exports = {
    createProjectValidation,
    updateProjectValidation,
};