const Comment = require("../models/Comment");

const getById = require("../services/baseService")

const getCommentById = async (
    commentId,
    populate = []
) =>
    await getById(Comment, commentId, populate, "Comment not found");

module.exports = getCommentById;