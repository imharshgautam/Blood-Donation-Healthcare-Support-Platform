require('dotenv').config();

const session = require('express-session');

const defaultApp = require('./app');
const { createApp } = defaultApp;
const { connectDatabase } = require('./config/db');
const { createSessionStore } = require('./config/session');

const port = Number(process.env.PORT) || 3000;

async function start() {
  let sessionStore;

  if (process.env.MONGODB_URI) {
    try {
      await connectDatabase();
      sessionStore = createSessionStore();
    } catch (error) {
      console.warn(`MongoDB unavailable (${error.message}); starting with in-memory sessions.`);
    }
  } else {
    console.warn('MONGODB_URI is not set; starting with in-memory sessions (browser-local features active).');
  }

  if (!sessionStore) {
    sessionStore = new session.MemoryStore();
  }

  const app = createApp({ sessionStore });
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Unable to start server:', error.message);
    process.exit(1);
  });
}

defaultApp.start = start;
module.exports = defaultApp;
