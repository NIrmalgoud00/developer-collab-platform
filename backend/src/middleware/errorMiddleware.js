const multer = require("multer");
const ApiError = require("../utils/ApiError");

const errorHandler = (
    err,
    req,
    res,
    next
) => {

    // Multer errors
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    const statusCode = err.statusCode || 500;

    // Unknown error
    res.status(statusCode).json({
        success: false,
        message: err.message
    });
};

module.exports = errorHandler;