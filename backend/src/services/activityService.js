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
    return await createActivity({
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
    return await createActivity({
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
    return await createActivity({
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
    return await createActivity({
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
    metadata
) => {
    return await createActivity({
        organization: organization._id,
        performedBy,
        action: ACTIVITY_ACTIONS.MEMBER_REMOVED,
        metadata,
    });
}

const logMemberRoleUpdate = async (
    organization,
    performedBy,
    metadata
) => {
    return await createActivity({
        organization: organization._id,
        performedBy,
        action: ACTIVITY_ACTIONS.MEMBER_ROLE_UPDATED,
        metadata,
    });
}

// Project
const logProjectCreated = async (
    project,
    performedBy,
) => {
    return await createActivity({
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
    return await createActivity({
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
    metadata
) => {
    return await createActivity({
        organization: project.organization,
        project: project._id,
        performedBy,
        action: ACTIVITY_ACTIONS.PROJECT_STATUS_CHANGED,
        metadata
    });
}

const logProjectDeleted = async (
    project,
    performedBy
) => {
    return await createActivity({
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
    return await createActivity({
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
    return await createActivity({
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
    return await createActivity({
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
    metadata
) => {
    return await createActivity({
        organization: task.organization,
        project: task.project,
        task: task._id,
        performedBy,
        action: ACTIVITY_ACTIONS.TASK_ASSIGNED,
        metadata,
    });
}

const logTaskMoved = async (
    task,
    performedBy,
    metadata
) => {
    return await createActivity({
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
    return await createActivity({
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
    return await createActivity({
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
    return await createActivity({
        organization: comment.organization,
        project: comment.project,
        task: comment.task,
        comment: comment._id,
        performedBy,
        action: ACTIVITY_ACTIONS.COMMENT_ARCHIVED,
    });
}


// Attachments
const logUploadFile = async (
    task,
    performedBy,
    metadata
) => {
    return await createActivity({
        organization: task.organization,
        project: task.project,
        task: task._id,
        performedBy,
        action: ACTIVITY_ACTIONS.ATTACHMENT_UPLOADED,
        metadata,
    });
}

const logDeleteFile = async (
    attachment,
    performedBy,
) => {
    return await createActivity({
        organization: attachment.organization,
        project: attachment.project,
        task: attachment.task,
        performedBy,
        action: ACTIVITY_ACTIONS.ATTACHMENT_DELETED,
        metadata: {
            attachmentId: attachment._id,
            fileName: attachment.originalname,
        },
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

    // Attachments
    logUploadFile,
    logDeleteFile,
}