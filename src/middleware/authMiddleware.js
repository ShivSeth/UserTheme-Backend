const jwt = require('jsonwebtoken');
const User = require('../modals/userModal');
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(401).json({ error: 'Not Authorized, No Token' });
  }
};

module.exports = { protect };
