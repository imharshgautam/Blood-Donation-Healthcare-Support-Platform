const express = require('express');
const session = require('express-session');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const { getSessionOptions } = require('./config/session');
const { notFound, errorHandler } = require('./middleware/errorHandler');

function createApp({ sessionStore } = {}) {
  const app = express();

  const trustProxy = Number(process.env.TRUST_PROXY) || 0;
  if (trustProxy > 0) app.set('trust proxy', trustProxy);

  app.disable('x-powered-by');
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }));
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: false, limit: '16kb' }));
  app.use(session(getSessionOptions(sessionStore)));

  app.use('/api/auth', authRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/public', express.static('public', { index: false }));
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
