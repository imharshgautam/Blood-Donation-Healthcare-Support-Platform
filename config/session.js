const MongoStore = require('connect-mongo');

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

  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is required');
  }

  return {
    name: 'blood_donation_session',
    secret: process.env.SESSION_SECRET,
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
