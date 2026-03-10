const { sendError } = require('../utils/apiResponse');

// Factory: isRole('admin') or isRole('teacher', 'admin')
const isRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. Requires role: ${roles.join(' or ')}`
      );
    }
    next();
  };
};

module.exports = { isRole };
