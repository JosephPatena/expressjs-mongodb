const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  getTask,
  getFigures,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const validateToken = require("../middleware/validateTokenHandler");

// router.use(validateToken);
router.post("/save", createTask);
router.post("/fetch-all", getTasks);
router.get("/fetch/:id", getTask);
router.get("/fetch-figures", getFigures);
router.post("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);

module.exports = router;
