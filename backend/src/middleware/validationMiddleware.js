const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return sendError(res, 400, message);
  }
  next();
};

module.exports = { validate };
