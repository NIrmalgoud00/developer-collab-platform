const Activity =
    require("../models/Activity");

const ACTIVITY_ACTIONS =
    require("../constants/activityActions")

const createActivity =
    async ({
        organization,
        project,
        task,
        comment,
        performedBy,
        action,
        metadata
    }) => {
        return await Activity.create({
            organization,
            project,
            task,
            comment,
            performedBy,
            action,
            metadata
        });
    }


// Organization
const logOrganizationCreated = async (
    organization,
    performedBy
) => {
    return createActivity({
        organization: organization._id,
        performedBy,
        action: ACTIVITY_ACTIONS.ORGANIZATION_CREATED,
        metadata: {
            organizationName: organization.name,
        },
    });
};

const logOrganizationUpdated = async (
    organization,
    performedBy,
    metadata
) => {
    return createActivity({
        organization: organization._id,
        performedBy,
        action: ACTIVITY_ACTIONS.ORGANIZATION_UPDATED,
        metadata,
    });
};

const logOrganizationDeleted = async (
    organization,
    performedBy
) => {
    return createActivity({
        organization: organization._id,
        performedBy,
        action: ACTIVITY_ACTIONS.ORGANIZATION_ARCHIVED,
    });
}

// Members
const logMemberInvited = async (
    organization,
    performedBy,
    userName
) => {
    return createActivity({
        organization: organization._id,
        performedBy,
        action: ACTIVITY_ACTIONS.MEMBER_INVITED,
        metadata: {
            userName,
        },
    });
};

const logMemberRemoved = async (
    organization,
    performedBy,
    userName
) => {
    return createActivity({
        organization: organization._id,
        performedBy,
        action: ACTIVITY_ACTIONS.MEMBER_REMOVED,
        metadata: {
            userName,
        },
    });
}

const logMemberRoleUpdate = async (
    organization,
    performedBy,
    userId,
    oldRole,
    newRole
) => {
    return createActivity({
        organization: organization._id,
        performedBy,
        action: ACTIVITY_ACTIONS.MEMBER_ROLE_UPDATED,
        metadata: {
            user: userId,
            oldRole,
            newRole
        },
    });
}

// Project
const logProjectCreated = async (
    project,
    performedBy,
) => {
    return createActivity({
        organization: project.organization,
        project: project._id,
        performedBy,
        action: ACTIVITY_ACTIONS.PROJECT_CREATED,
        metadata: {
            projectName: project.name
        },
    });
}

const logProjectUpdated = async (
    project,
    performedBy,
    metadata
) => {
    return createActivity({
        organization: project.organization,
        project: project._id,
        performedBy,
        action: ACTIVITY_ACTIONS.PROJECT_UPDATED,
        metadata
    });
}

const logProjectStatusChange = async (
    project,
    performedBy,
    oldStatus,
    newStatus
) => {
    return createActivity({
        organization: project.organization,
        project: project._id,
        performedBy,
        action: ACTIVITY_ACTIONS.PROJECT_STATUS_CHANGED,
        metadata: {
            oldStatus,
            newStatus
        }
    });
}

const logProjectDeleted = async (
    project,
    performedBy
) => {
    return createActivity({
        organization: project.organization,
        project: project._id,
        performedBy,
        action: ACTIVITY_ACTIONS.PROJECT_ARCHIVED,
    });
}

// Task
const logTaskCreated = async (
    task,
    performedBy,
) => {
    return createActivity({
        organization: task.organization,
        project: task.project,
        task: task._id,
        performedBy,
        action: ACTIVITY_ACTIONS.TASK_CREATED,
        metadata: {
            taskName: task.title
        },
    });
}

const logTaskUpdated = async (
    task,
    performedBy,
    metadata
) => {
    return createActivity({
        organization: task.organization,
        project: task.project,
        task: task._id,
        performedBy,
        action: ACTIVITY_ACTIONS.TASK_UPDATED,
        metadata,
    });
}

const logTaskDeleted = async (
    task,
    performedBy
) => {
    return createActivity({
        organization: task.organization,
        project: task.project,
        task: task._id,
        performedBy,
        action: ACTIVITY_ACTIONS.TASK_ARCHIVED,
    });
}

const logTaskAssigned = async (
    task,
    performedBy,
    newAssignee,
    previousAssignee
) => {
    return createActivity({
        organization: task.organization,
        project: task.project,
        task: task._id,
        performedBy,
        action: ACTIVITY_ACTIONS.TASK_ASSIGNED,
        metadata: {
            previousAssignee: previousAssignee || null,
            newAssignee,
        },
    });
}

const logTaskMoved = async (
    task,
    performedBy,
    metadata
) => {
    return createActivity({
        organization: task.organization,
        project: task.project,
        task: task._id,
        performedBy,
        action: ACTIVITY_ACTIONS.TASK_MOVED,
        metadata,
    });
}


// Comments
const logCommentCreated = async (
    comment,
    performedBy,
) => {
    return createActivity({
        organization: comment.organization,
        project: comment.project,
        task: comment.task,
        comment: comment._id,
        performedBy,
        action: ACTIVITY_ACTIONS.COMMENT_CREATED,
        metadata: {
            commentContent: comment.content
        },
    });
}

const logCommentUpdated = async (
    comment,
    performedBy,
    metadata
) => {
    return createActivity({
        organization: comment.organization,
        project: comment.project,
        task: comment.task,
        comment: comment._id,
        performedBy,
        action: ACTIVITY_ACTIONS.COMMENT_UPDATED,
        metadata,
    });
}

const logCommentDeleted = async (
    comment,
    performedBy
) => {
    return createActivity({
        organization: comment.organization,
        project: comment.project,
        task: comment.task,
        comment: comment._id,
        performedBy,
        action: ACTIVITY_ACTIONS.COMMENT_ARCHIVED,
    });
}

module.exports = {
    // Organization
    logOrganizationCreated,
    logOrganizationUpdated,
    logOrganizationDeleted,

    // Members
    logMemberInvited,
    logMemberRemoved,
    logMemberRoleUpdate,

    // Project 
    logProjectCreated,
    logProjectUpdated,
    logProjectStatusChange,
    logProjectDeleted,

    // Task
    logTaskCreated,
    logTaskUpdated,
    logTaskDeleted,
    logTaskAssigned,
    logTaskMoved,

    // Comment
    logCommentCreated,
    logCommentUpdated,
    logCommentDeleted,
}