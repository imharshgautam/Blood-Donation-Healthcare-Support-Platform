require('dotenv').config();

const { createApp } = require('./app');
const { connectDatabase } = require('./config/db');
const { createSessionStore } = require('./config/session');

const port = Number(process.env.PORT) || 3000;

async function start() {
  await connectDatabase();
  const app = createApp({ sessionStore: createSessionStore() });
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Unable to start server:', error.message);
    process.exit(1);
  });
}

module.exports = { start };
