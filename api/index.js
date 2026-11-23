require('dotenv').config();

const session = require('express-session');

const { createApp } = require('../app');
const { connectDatabase } = require('../config/db');
const { createSessionStore } = require('../config/session');

let cachedApp = null;
let initPromise = null;

async function getApp() {
  if (cachedApp) return cachedApp;

  if (!initPromise) {
    initPromise = (async () => {
      let sessionStore;
      if (process.env.MONGODB_URI) {
        try {
          await connectDatabase();
          sessionStore = createSessionStore();
        } catch (error) {
          console.warn(`MongoDB unavailable (${error.message}); using in-memory sessions.`);
        }
      }
      if (!sessionStore) {
        sessionStore = new session.MemoryStore();
      }
      cachedApp = createApp({ sessionStore });
      return cachedApp;
    })();
  }

  return initPromise;
}

module.exports = async (req, res) => {
  const app = await getApp();
  return app(req, res);
};
