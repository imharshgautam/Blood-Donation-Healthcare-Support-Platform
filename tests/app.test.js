process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-only-session-secret-with-enough-length';

const request = require('supertest');
const session = require('express-session');

const { createApp } = require('../app');

describe('application routes and static pages', () => {
  const app = createApp({ sessionStore: new session.MemoryStore() });

  test('serves the home page and all HTML routes', async () => {
    const home = await request(app).get('/').expect(200);
    expect(home.text).toContain('Give Blood, Save Lives');

    for (const page of ['index', 'donate', 'contact', 'login', 'signup', 'admin']) {
      const response = await request(app).get(`/${page}.html`).expect(200);
      expect(response.headers['content-type']).toMatch(/text\/html/);
    }
  });

  test('serves static assets from /assets', async () => {
    await request(app).get('/assets/styles/style.css').expect(200);
    await request(app).get('/assets/scripts/platform-data.js').expect(200);
  });

  test('reports health status and database state', async () => {
    const response = await request(app).get('/api/health').expect(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      database: 'disconnected',
    });
  });

  test('exports callable Express handlers from app.js and server.js for serverless hosts', () => {
    const exportedApp = require('../app');
    const exportedServer = require('../server');
    expect(typeof exportedApp).toBe('function');
    expect(typeof exportedServer).toBe('function');
  });

  test('returns 503 on database auth routes when MongoDB is disconnected', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'donor', password: 'Password1' })
      .expect(503);

    expect(response.body.message).toMatch(/Database is not connected/i);
  });
});
