const Attachment = require("../models/Attachment");
const ApiError = require("../utils/ApiError");

const getAttachmentById = async (attachmentId, populate = []) => {

    let query = Attachment.findOne({
        _id: attachmentId,
        archived: false,
    });

    if (populate.length > 0) {
        populate.forEach((item) => {
            query = query.populate(item);
        });
    }

    const attachment = await query;

    if (!attachment) {
        throw new ApiError(404, "Attachment not found");
    }

    return attachment;
};

module.exports = getAttachmentById;