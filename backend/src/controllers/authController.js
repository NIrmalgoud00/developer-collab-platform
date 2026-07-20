const User = require('../models/User')
const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

exports.register = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(
            400,
            "User already exists"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });

});

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};


// exports.getMe = async (req, res, next) => {
//     try {
//         res.status(200).json({
//             success: true,
//             user: req.user,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

exports.getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

