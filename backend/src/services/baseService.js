const ApiError = require(
    "../utils/ApiError"
);

const getById = async (Model, id, populate = [], message) => {
    let query = Model.findById(id);

    if (populate.length > 0) {
        populate.forEach((item) => {
            query = query.populate(item);
        });
    }

    const document = await query;

    if (!document) {
        throw new ApiError(404, message);
    }

    return document;
};

module.exports = getById;
