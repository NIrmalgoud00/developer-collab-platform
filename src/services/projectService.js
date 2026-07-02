const Project = require(
    "../models/Project"
);

const ApiError = require(
    "../utils/ApiError"
);

const getProjectById = async (projectId, populates = []) => {

    return getById(Project, projectId, "Project not found");

}

module.exports = getProjectById;



// My next recommendation is to apply the same pattern to the Task collection:

// Store project as an indexed ObjectId.
// Add compound indexes like { project: 1, status: 1, order: 1 } for fast Kanban board loading.
// Never store task IDs in the Project document. This keeps both Project and Task collections scalable.