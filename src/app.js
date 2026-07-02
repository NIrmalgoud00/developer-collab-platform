const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/organizations", organizationRoutes);
app.use(projectRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server Running"
    });
});

app.use(errorHandler);

module.exports = app;