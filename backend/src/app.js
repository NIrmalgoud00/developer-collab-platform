const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const organizationRouter = require("./routes/organizationRoutes");
const projectRouter = require("./routes/projectRoutes");
const taskRouter = require("./routes/taskRoutes");
const commentRouter = require("./routes/commentRoutes");
const attachmentRouter = require("./routes/attachmentRoutes");
const notificationRouter = require("./routes/notificationRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/organizations", organizationRouter);
app.use(projectRouter);
app.use(taskRouter);
app.use(attachmentRouter);
app.use(commentRouter);
app.use("/api/notifications", notificationRouter);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server Running"
    });
});

app.use(errorHandler);

module.exports = app;

// Assign or Move are both left to check and save in postman