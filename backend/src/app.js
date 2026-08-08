const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const commentRoutes = require("./routes/commentRoutes");
const attachmentRouter = require("./routes/attachmentRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/organizations", organizationRoutes);
app.use(projectRoutes);
app.use(taskRoutes);
app.use(attachmentRouter);
app.use(commentRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server Running"
    });
});

app.use(errorHandler);

module.exports = app;

// Assign or Move are both left to check and save in postman