const { body } = require(
    "express-validator"
);

exports.registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage(
            "Name must be at least 3 characters"
        ),

    body("email")
        .isEmail()
        .withMessage(
            "Please provide valid email"
        ),

    body("password")
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .withMessage(
            "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),
];

exports.loginValidation = [
    body("email")
        .isEmail()
        .withMessage(
            "Please provide valid email"
        ),

    body("password")
        .notEmpty()
        .withMessage(
            "Password is required"
        ),
];