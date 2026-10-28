const express = require('express');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }));
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: false, limit: '16kb' }));

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
