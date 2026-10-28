const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function signup(req, res, next) {
  try {
    const email = req.body.email.trim().toLowerCase();
    const username = req.body.username.trim();

    const existingUser = await User.findOne({ email }).select('_id').lean();
    if (existingUser) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({ email, username, passwordHash });

    return res.status(201).json({
      message: 'Account created successfully',
      user: user.toSafeJSON(),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }
    return next(error);
  }
}

module.exports = { signup };
