const Task = require("../models/Task");

const getById = require("../services/baseService")

const getTaskById = async (
    taskId,
    populate = []
) =>
    await getById(Task, taskId, populate, "Task not found");

module.exports = getTaskById;