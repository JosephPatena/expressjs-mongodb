const projectResource = require("../resources/projectResource");
const userResource = require("../resources/userResource");
const asyncHandler = require("express-async-handler");
const { formatDate } = require('../utils/dateUtils');
const Project = require('../models/projectModel');
const User = require('../models/userModel');

const taskResource = asyncHandler(async (tasks) => {
    // Check if tasks is an array or a single object
    if (Array.isArray(tasks)) {
        // Handle array of tasks
        return Promise.all(tasks.map(async (task) => await formatTask(task)));
    } else {
        // Handle single task
        return await formatTask(tasks);
    }
});

// Helper function to format a single task
const formatTask = async (task) => {
    // Fetch associated project and users asynchronously
    const project = await Project.findById(task.project_id);
    const assignedUser = await User.findById(task.assigned_user_id);
    const createdBy = await User.findById(task.createdBy);
    const updatedBy = await User.findById(task.updatedBy);

    return {
        id: task._id,
        name: task.name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? formatDate(task.due_date) : null,
        start_date: task.start_date ? formatDate(task.start_date) : null,
        complete_date: task.complete_date ? formatDate(task.complete_date) : null,
        assigned_user_id: task.assigned_user_id,
        tester_user_id: task.tester_user_id,
        reviewer_user_id: task.reviewer_user_id,
        project_id: task.prroject_id,
        project: project ? await projectResource(project) : null,
        createdBy: createdBy ? await userResource(createdBy) : null,
        updatedBy: updatedBy ? await userResource(updatedBy) : null,
        assignedUser: assignedUser ? await userResource(assignedUser) : null,
    };
};

module.exports = taskResource;
