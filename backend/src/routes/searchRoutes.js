const express = require("express");

const searchRouter = express.Router();

const protect = require("../middleware/authMiddleware");

const { getSearchTasks } = require("../controllers/searchController")

const { loadOrganization, authorizeOrganizationRole } =
  require("../middleware/organizationMiddleware")

searchRouter.get(
  "/:organizationId/search",
  protect,
  loadOrganization,
  authorizeOrganizationRole(
    "org_admin",
    "project_manager",
    "developer"
  ),
  getSearchTasks
);

module.exports = searchRouter