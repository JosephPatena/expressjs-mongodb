const projectResource = require("../resources/projectResource");
const asyncHandler = require("express-async-handler");
const Project = require('../models/projectModel');

//@desc Get All Projects
//@route GET /api/project/fetch-all
//@access private
const getProjects = asyncHandler(async (req, res) => {
  try {
      let query = Project.find();

      const sortField = req.query.sort_field || 'createdAt';
      const sortDirection = req.query.sort_direction === 'asc' ? 1 : -1;

      if (req.query.keyword) {
          const keyword = new RegExp(req.query.keyword, 'i');
          query = query.or([{ name: keyword }, { description: keyword }]);
      }

      if (req.query.statuses && req.query.statuses.length > 0) {
          query = query.where('status').in(req.query.statuses);
      }

      if (req.query.from_project_page) {
          const projects = await query
              .sort({ [sortField]: sortDirection })
              .skip((parseInt(req.query.page) - 1) * parseInt(req.query.show))
              .limit(parseInt(req.query.show))
              .exec();
              
          res.json({
              data: await projectResource(projects),
              currentPage: req.query.page,
              totalPages: Math.ceil(await Project.countDocuments(query) / req.query.show)
          });
      } else {
          const projects = await query
              .sort({ createdAt: -1 })
              .limit(parseInt(req.query.show))
              .exec();
              
          res.json({ 
            data: await projectResource(projects)
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
});

//@desc Create New Project
//@route POST /api/project/save
//@access private
const createProject = asyncHandler(async (req, res) => {
  // console.log("The request body is :", req.body);
  const {
    name,
    description,
    due_date,
    status
  } = req.body;
  
  const data = await Project.create({
    name,
    description,
    due_date,
    status
  });

  res.status(201).json(await projectResource(data));
});

//@desc Get Project
//@route GET /api/project/fetch/:id
//@access private
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // if (project.user_id !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User unauthorized for this operation");
  // }

  res.status(200).json({project: await projectResource(project)});
});

//@desc Update Project
//@route PUT /api/project/update/:id
//@access private
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // if (project.user_id.toString() !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User don't have permission to update other user Projects");
  // }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(await projectResource(updatedProject));
});

//@desc Delete Project
//@route DELETE /api/project/delete/:id
//@access private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  // if (project.user_id.toString() !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User don't have permission to update other user Projects");
  // }
  await Project.findByIdAndRemove(req.params.id);
  res.status(200).json(project);
});

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
};
