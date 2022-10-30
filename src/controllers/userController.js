const User = require('../modals/userModal');
const { generateToken } = require('../utils/generateToken');

// @description Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user)
    res.status(401).json({ error: 'Email not registered - Please Sign Up' });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      theme: user.theme,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ error: 'Invalid Email or Password' });
  }
};

// @description Get all users
// @route GET /api/users
const getUsers = async function (req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// @description Add new user
// @route POST /api/users
const addUser = async function (req, res) {
  const { name, email, password, theme } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
      theme,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      theme: user.theme,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.code === 11000)
      res
        .status(400)
        .json({ error: 'Email already registered - Kindly Login' });
    else res.status(400).json({ error: error.message });
  }
};

// @description Update theme
// @route PUT /api/users/theme/:id
const updateTheme = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    user.theme = req.body.theme;

    const updatedUser = await user.save();
    res.status(202).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      theme: updatedUser.theme,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  addUser,
  updateTheme,
  authUser,
};
