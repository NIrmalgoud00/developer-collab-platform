const { body } = require(
    "express-validator"
);

const createTaskValidation = [

    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3 })
        .withMessage("Minimum 3 characters"),

    body("status")
        .optional()
        .isIn([
            "todo",
            "in_progress",
            "review",
            "done"
        ]),

    body("priority")
        .optional()
        .isIn([
            "low",
            "medium",
            "high",
            "critical"
        ])

];

const updateTaskValidation = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("status")
        .optional()
        .isIn(["todo", "in_progress", "review", "done"])
        .withMessage("Invalid status"),

    body("priority")
        .optional()
        .isIn(["low", "medium", "high", "critical"])
        .withMessage("Invalid priority"),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid date"),

    body("labels")
        .optional()
        .isArray()
        .withMessage("Labels must be an array"),

    body("labels.*")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Label cannot be empty"),
];


const assignTaskValidation = [

    body("userId")
        .notEmpty()
        .withMessage("User is required")

        .isMongoId()
        .withMessage("Invalid user id")

];

const moveTaskValidation = [
    body("status")
        .isIn([
            "todo",
            "in_progress",
            "review",
            "done"
        ]),

    body("position")
        .isInt({
            min: 0
        })

];

module.exports = {
    createTaskValidation,
    updateTaskValidation,
    assignTaskValidation,
    moveTaskValidation,
};
