const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const validateToken = require("../middleware/validateTokenHandler");

// router.use(validateToken);
router.post("/save", createProject);
router.post("/fetch-all", getProjects);
router.get("/fetch/:id", getProject);
router.post("/update/:id", updateProject);
router.delete("/delete/:id", deleteProject);

module.exports = router;
