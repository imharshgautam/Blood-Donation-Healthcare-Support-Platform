const express = require('express');
const { body } = require('express-validator');

const { signup } = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/signup', [
  body('email')
    .isString()
    .trim()
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false })
    .withMessage('Enter a valid email address'),
  body('username')
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, dots, underscores, or hyphens'),
  body('password')
    .isString()
    .isLength({ min: 8, max: 72 })
    .matches(/[a-z]/)
    .matches(/[A-Z]/)
    .matches(/[0-9]/)
    .withMessage('Password must be 8-72 characters and include uppercase, lowercase, and numeric characters'),
  body('confirmPassword')
    .optional()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Password confirmation does not match'),
  body('tandc')
    .optional()
    .isBoolean()
    .toBoolean()
    .custom((value) => value === true)
    .withMessage('You must accept the terms'),
], validate, signup);

module.exports = router;
