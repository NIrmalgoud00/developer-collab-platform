const Organization = require(
    "../models/Organization"
);

const ApiError = require(
    "../utils/ApiError"
);

const getById = require(
    "../services/baseService"
);

const getOrganizationById = async (organizationId) => {

    return getById(Organization, organizationId, "Organization not found")

    // const organization =
    //     await Organization.findById(
    //         organizationId
    //     );

    // if (!organization) {
    //     new ApiError(
    //         404,
    //         "Organization not found"
    //     );
    // }

    // return organization;
}

module.exports = getOrganizationById;

