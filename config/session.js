const crypto = require('crypto');
const MongoStore = require('connect-mongo');

let fallbackSecret;

function resolveSessionSecret() {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }
  if (!fallbackSecret) {
    fallbackSecret = crypto.randomBytes(32).toString('hex');
    console.warn('SESSION_SECRET is not set; using an ephemeral per-process secret.');
  }
  return fallbackSecret;
}

function createSessionStore() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }

  return MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600,
  });
}

function getSessionOptions(store) {
  const maxAge = Number(process.env.SESSION_MAX_AGE_MS) || 86400000;

  return {
    name: 'blood_donation_session',
    secret: resolveSessionSecret(),
    store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    },
  };
}

module.exports = { createSessionStore, getSessionOptions };
