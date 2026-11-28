const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const { createSessionStore, getSessionOptions } = require('./config/session');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const PAGES = ['index', 'login', 'signup', 'donate', 'contact', 'admin'];
const ASSETS_DIR = path.join(__dirname, 'assets');
const PAGES_DIR = path.join(__dirname, 'pages');

function createApp({ sessionStore } = {}) {
  const app = express();

  let resolvedStore = sessionStore;
  if (!resolvedStore && process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    try {
      resolvedStore = createSessionStore();
    } catch (error) {
      console.warn(`Unable to initialize Mongo session store (${error.message}); using MemoryStore.`);
    }
  }
  if (!resolvedStore) {
    resolvedStore = new session.MemoryStore();
  }

  const trustProxy = process.env.TRUST_PROXY !== undefined
    ? Number(process.env.TRUST_PROXY) || 0
    : (process.env.VERCEL ? 1 : 0);
  if (trustProxy > 0) app.set('trust proxy', trustProxy);

  app.disable('x-powered-by');
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }));
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: false, limit: '16kb' }));
  app.use(session(getSessionOptions(resolvedStore)));

  app.use('/api/auth', authRoutes);

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  });

  app.use('/assets', express.static(ASSETS_DIR, { index: false }));

  for (const page of PAGES) {
    const sendPage = (req, res) => {
      res.sendFile(`${page}.html`, { root: PAGES_DIR });
    };
    app.get(`/${page}.html`, sendPage);
    app.get(`/pages/${page}.html`, sendPage);
    if (page !== 'index') {
      app.get(`/${page}`, (req, res) => res.redirect(`/${page}.html`));
    }
  }
  app.get('/', (req, res) => res.sendFile('index.html', { root: PAGES_DIR }));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

const app = createApp();
app.createApp = createApp;

module.exports = app;
