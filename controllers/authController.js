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

async function login(req, res, next) {
  try {
    const identifier = req.body.username.trim();
    const user = await User.findOne(identifier.includes('@')
      ? { email: identifier.toLowerCase() }
      : { username: identifier });

    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.regenerate((error) => {
      if (error) return next(error);

      req.session.userId = user.id;
      if (req.body.remember) {
        req.session.cookie.maxAge = Number(process.env.SESSION_MAX_AGE_MS) || 2592000000;
      }

      req.session.save((saveError) => {
        if (saveError) return next(saveError);
        return res.json({ message: 'Signed in successfully', user: user.toSafeJSON() });
      });
    });
  } catch (error) {
    return next(error);
  }
}

function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie('blood_donation_session', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.json({ message: 'Signed out successfully' });
  });
}

function me(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}

function csrfToken(req, res) {
  res.json({ csrfToken: res.locals.csrfToken });
}

module.exports = { signup, login, logout, me, csrfToken };
