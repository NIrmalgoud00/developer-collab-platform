const { body } = require(
    "express-validator"
);

exports.createProjectValidation =
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