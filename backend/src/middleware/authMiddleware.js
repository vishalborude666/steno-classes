const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Not authorized, no token');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return sendError(res, 401, 'Not authorized, user not found');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, 'Not authorized, invalid token');
  }
};

module.exports = { protect };
