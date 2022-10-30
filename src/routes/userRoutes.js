const express = require('express');
const {
  addUser,
  getUsers,
  updateTheme,
  authUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getUsers);
router.route('/signup').post(addUser);
router.route('/login').post(authUser);
router.route('/theme/:id').put(protect, updateTheme);

module.exports = router;
