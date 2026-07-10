const Organization = require(
    "../models/Organization"
);

const ApiError = require(
    "../utils/ApiError"
);

const getById = require(
    "./baseService"
);

const getOrganizationById = async (organizationId, populate = []) =>
    await getById(Organization, organizationId, populate, "Organization not found")

module.exports = getOrganizationById;

