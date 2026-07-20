const Activity = require("../models/Activity")

const baseGetActivities = async (
    filter = {},
    options = {}
) => {

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 20;
    const skip = (page - 1) * limit;

    // let query = Activity.find(filter);

    let data = await Activity.find(filter);


    // Populate
    // if (options.populate?.length) {
    //     options.populate.forEach((item) => {
    //         query = query.populate(item);
    //     });
    // }

    // Sort
    // if (options.sort) {
    //     query = query.sort(options.sort);
    // }

    // Pagination
    // query = query.skip(skip).limit(limit);

    // const [data, total] = await Promise.all([
    //     query,
    //     Activity.countDocuments(filter),
    // ]);

    return {
        data,
        // pagination: {
        //     total,
        //     page,
        //     limit,
        //     totalPages: Math.ceil(total / limit),
        //     hasNext: page * limit < total,
        //     hasPrev: page > 1,
        // },
    };
};

module.exports = {
    baseGetActivities,
};