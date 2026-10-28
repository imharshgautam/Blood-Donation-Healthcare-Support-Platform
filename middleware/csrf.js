const crypto = require('crypto');

function ensureCsrfToken(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
}

function csrf(req, res, next) {
  const suppliedToken = req.get('x-csrf-token');
  if (!suppliedToken || !req.session.csrfToken || !safeEqual(suppliedToken, req.session.csrfToken)) {
    return res.status(403).json({ message: 'Invalid or missing CSRF token' });
  }
  return next();
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

module.exports = { ensureCsrfToken, csrf };
