const express = require("express");

const authRoutes = express.Router();

const {
    register,
    login,
    getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const validate = require(
    "../middleware/validate"
);

const {
    registerValidation,
    loginValidation,
} = require(
    "../validations/authValidation"
);

authRoutes.post("/register", registerValidation,
    validate, register);

authRoutes.post("/login", loginValidation,
    validate, login);

authRoutes.get("/me", protect, getMe);

// GET / api / users / me / activities
// authRoutes.get("/me/activities", protect, getMeActivities);
// do later


module.exports = authRoutes;