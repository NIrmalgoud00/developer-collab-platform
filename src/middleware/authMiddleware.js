const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = await User.findById(
            decoded.userId
        ).select("-password");

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token invalid",
        });
    }
};

module.exports = protect;