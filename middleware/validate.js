const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    message: 'Please correct the highlighted fields',
    errors: errors.array().map(({ path, param, msg }) => ({ field: path || param, message: msg })),
  });
}

module.exports = validate;
