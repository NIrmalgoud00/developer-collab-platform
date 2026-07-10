const ApiError = require(
    "../utils/ApiError"
);

const getById = async (Model, id, populate = [], message) => {
    let document = Model.findById(id);

    if (populate.lemgth > 0) {
        populate.forEach((item) => {
            query = query.populate(item);
        });
    }
    if (!document) {
        throw new ApiError(404, message);
    }

    return document;
};

module.exports = getById;
