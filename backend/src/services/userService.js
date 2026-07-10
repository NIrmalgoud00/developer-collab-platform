const User = require("../models/User");

const getById = require("../services/baseService")

const getUserById = async (
    userId,
    populate = []
) =>
    await getById(User, userId, populate, "User not found");

module.exports = getUserById;