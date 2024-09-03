const userResource = require("../resources/userResource");
const asyncHandler = require("express-async-handler");
const { formatDate } = require('../utils/dateUtils');
const User = require('../models/userModel');

const projectResource = asyncHandler(async (projects) => {
    // Check if projects is an array or a single object
    if (Array.isArray(projects)) {
        // Handle array of projects
        return Promise.all(projects.map(async (project) => await formatProject(project)));
    } else {
        // Handle single project
        return await formatProject(projects);
    }
});

// Helper function to format a single project
const formatProject = async (project) => {
    const createdBy = await User.findById(project.created_by);
    const updatedBy = await User.findById(project.updated_by);

    return {
        id: project._id,
        name: project.name,
        description: project.description,
        status: project.status,
        due_date: project.due_date ? formatDate(project.due_date) : null,
        image_path: project.image_path,
        created_at: project.createdAt ? formatDate(project.createdAt) : null,
        createdBy: createdBy ? await userResource(createdBy) : null,
        updatedBy: updatedBy ? await userResource(updatedBy) : null,
    };
};

module.exports = projectResource;
