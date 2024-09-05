const taskResource = require('../resources/taskResource');
const asyncHandler = require("express-async-handler");
const Task = require('../models/taskModel');

//@desc Get All Tasks
//@route POST /api/task/fetch-all
//@access private
const getTasks = asyncHandler(async (req, res) => {
  try {
    let query = Task.find();

    const sortField = req.sort_field || 'createdAt';
    const sortDirection = req.sort_direction === 'asc' ? 1 : -1;

    if (req.keyword) {
      const keyword = new RegExp(req.keyword, 'i');
      query = or([{ name: keyword }, { description: keyword }]);
    }

    if (req.statuses && req.statuses.length > 0) {
      query = where('status').in(req.statuses);
    }

    if (req.project_ids && req.project_ids.length > 0) {
      query = where('_id').in(req.project_ids);
    }

    if (req.from_task_page) {
      const tasks = await query
          .sort({ [sortField]: sortDirection })
          .skip((parseInt(req.page) - 1) * parseInt(req.show))
          .limit(parseInt(req.show))
          .exec();

      res.json({
          data: await taskResource(tasks),
          currentPage: req.page,
          totalPages: Math.ceil(await Task.countDocuments(query) / req.show)
      });
    } else {
      const tasks = await query
          .sort({ createdAt: -1 })
          .limit(parseInt(req.show))
          .exec();

      res.json({ 
        data: await taskResource(tasks)
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//@desc Create New Task
//@route POST /api/task/save
//@access private
const createTask = asyncHandler(async (req, res) => {
  // console.log("The request body is :", req.body);
  const {
    project_id,
    name,
    description,
    due_date,
    status,
    priority,
    assigned_user_id,
    tester_user_id,
    reviewer_user_id
  } = req.body;

  const task = await Task.create({
    name,
    description,
    status,
    priority,
    due_date,
    project_id,
    assigned_user_id: assigned_user_id != 0 ? assigned_user_id : null,
    tester_user_id: tester_user_id != 0 ? tester_user_id : null,
    reviewer_user_id: reviewer_user_id != 0 ? reviewer_user_id : null,
  });

  res.status(201).json({ 
    task: await taskResource(task)
  });
});

//@desc Get Figures
//@route GET /api/task/fetch-figures
//@access private
const getFigures = asyncHandler(async (req, res) => {
  try {
    const allTasks = await Task.countDocuments();
    const totalPendingTasks = await Task.countDocuments({ status: 'pending' });
    const totalProgressTasks = await Task.countDocuments({ status: 'in_progress' });
    const totalTestingTasks = await Task.countDocuments({ status: 'testing' });
    const totalCompletedTasks = await Task.countDocuments({ status: 'completed' });

    res.status(200);
    res.json({
      allTasks: allTasks,
      totalPendingTasks: totalPendingTasks,
      totalProgressTasks: totalProgressTasks,
      totalTestingTasks: totalTestingTasks,
      totalCompletedTasks: totalCompletedTasks,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong.");
  }
});

//@desc Get Task
//@route GET /api/task/:id
//@access private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // if (task.user_id !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User unauthorized for this operation");
  // }

  res.status(200).json({task : await taskResource(task)});
});

//@desc Update Task
//@route PUT /api/Tasks/:id
//@access private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // If you want to implement permission checking, uncomment this block
  // if (task.user_id.toString() !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User doesn't have permission to update other user's Tasks");
  // }

  let toUpdate = {};

  const { column, value, priority, status } = req.body;

  // Uncomment the following line for debugging
  // res.send({column, value, priority, status});

  if (column && value) {
    toUpdate[column] = value;
  }
  
  if (priority) {
    toUpdate.priority = priority;
  }

  if (status) {
    toUpdate.status = status;
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    toUpdate,
    { new: true }
  );

  if (!updatedTask) {
    res.status(500);
    throw new Error("Failed to update task");
  }

  res.status(200).json({ data: updatedTask });
});


//@desc Delete Task
//@route DELETE /api/Tasks/:id
//@access private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  if (task.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user Tasks");
  }
  await Task.findByIdAndRemove(req.params.id);
  res.status(200).json(task);
});

module.exports = {
  getTasks,
  createTask,
  getTask,
  getFigures,
  updateTask,
  deleteTask,
};
