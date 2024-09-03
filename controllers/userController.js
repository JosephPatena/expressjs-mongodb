const userResource = require("../resources/userResource");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // console.log(`User created ${user}`);
  if (user) {
    res.status(201).json(await userResource(user));
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc Current User info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});


//@desc Get All Users
//@route GET /api/user/fetch-all
//@access private
const getUsers = asyncHandler(async (req, res) => {
  try {
      let query = User.find();

      const sortField = req.query.sort_field || 'createdAt';
      const sortDirection = req.query.sort_direction === 'asc' ? 1 : -1;

      if (req.query.keyword) {
          const keyword = new RegExp(req.query.keyword, 'i');
          query = query.or([{ name: keyword }, { description: keyword }]);
      }

      const users = await query
          .sort({ [sortField]: sortDirection })
          .skip((parseInt(req.query.page) - 1) * parseInt(req.query.show))
          .limit(parseInt(req.query.show))
          .exec();
          
      res.json({
          data: await userResource(users)
      });
  } catch (err) {
      res.status(500).send(err);
  }
});

//@desc Get User
//@route GET /api/user/fetch/:id
//@access private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // if (user.id !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User unauthorized for this operation");
  // }

  res.status(200).json({user: await userResource(user)});
});

//@desc Update User
//@route PUT /api/user/update/:id
//@access private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, email, password } = req.body;
  if (!email || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  // if (user.id.toString() !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User don't have permission to update other user Users");
  // }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      name, email, password: await bcrypt.hash(password, 10)
    }, 
    { new: true }
  );

  res.status(200).json(await userResource(updatedUser));
});

//@desc Delete User
//@route DELETE /api/user/delete/:id
//@access private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  // if (user.id.toString() !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User don't have permission to update other user users");
  // }
  await User.findByIdAndRemove(req.params.id);
  res.status(200).json(user);
});

module.exports = {
  loginUser, 
  registerUser, 
  currentUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
