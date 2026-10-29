const User = require('../models/User');

async function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: 'Authentication required' });
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = requireAuth;
