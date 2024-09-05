const { storeUserRequest, validate } = require('../validators/storeUserRequest');
const { updateUserRequest, validateUpdateUserRequest } = require('../validators/updateUserRequest');
const express = require("express");
const {
  loginUser,
  registerUser,
  currentUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", storeUserRequest(), validate, registerUser);
router.get("/current", validateToken, currentUser);

// router.use(validateToken);
router.get("/fetch/:id", getUser);
router.post("/fetch-all", getUsers);
router.post("/update/:id", updateUserRequest(), validateUpdateUserRequest, updateUser);
router.delete("/delete/:id", deleteUser);

module.exports = router;
