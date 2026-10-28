process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-only-session-secret-with-enough-length';

const request = require('supertest');
const session = require('express-session');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { createApp } = require('../app');
const { connectDatabase, disconnectDatabase } = require('../config/db');
const User = require('../models/User');

let mongoServer;
let agent;
let app;

async function csrfFor(testAgent) {
  const response = await testAgent.get('/api/auth/csrf').expect(200);
  return response.body.csrfToken;
}

async function postWithCsrf(testAgent, path, body, expectedStatus) {
  const csrfToken = await csrfFor(testAgent);
  const response = await testAgent
    .post(path)
    .set('x-csrf-token', csrfToken)
    .send(body);
  expect(response.status).toBe(expectedStatus);
  return response;
}

describe('authentication API', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await connectDatabase();
    app = createApp({ sessionStore: new session.MemoryStore() });
  });

  beforeEach(async () => {
    await User.deleteMany({});
    agent = request.agent(app);
  });

  afterAll(async () => {
    await disconnectDatabase();
    await mongoServer.stop();
  });

  test('registers a valid user and hashes the password', async () => {
    const response = await postWithCsrf(agent, '/api/auth/signup', {
      email: 'donor@example.com',
      username: 'DonorUser',
      password: 'SecurePass1',
      tandc: true,
    }, 201);

    expect(response.body).toMatchObject({
      message: 'Account created successfully',
      user: { email: 'donor@example.com', username: 'DonorUser' },
    });
    expect(response.body.user).not.toHaveProperty('passwordHash');

    const storedUser = await User.findOne({ email: 'donor@example.com' });
    expect(storedUser.passwordHash).not.toBe('SecurePass1');
    await expect(storedUser.comparePassword('SecurePass1')).resolves.toBe(true);
  });

  test('rejects invalid signup data', async () => {
    const response = await postWithCsrf(agent, '/api/auth/signup', {
      email: 'not-an-email',
      username: 'x',
      password: 'weak',
      tandc: false,
    }, 400);

    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'email' }),
      expect.objectContaining({ field: 'password' }),
    ]));
  });

  test('rejects duplicate email registration', async () => {
    const payload = {
      email: 'duplicate@example.com',
      username: 'DuplicateUser',
      password: 'SecurePass1',
      tandc: true,
    };
    await postWithCsrf(agent, '/api/auth/signup', payload, 201);

    await postWithCsrf(agent, '/api/auth/signup', payload, 409);
  });

  test('logs in, exposes a safe profile, and logs out', async () => {
    await postWithCsrf(agent, '/api/auth/signup', {
      email: 'login@example.com',
      username: 'LoginUser',
      password: 'SecurePass1',
      tandc: true,
    }, 201);

    const loginResponse = await postWithCsrf(agent, '/api/auth/login', {
      username: 'login@example.com',
      password: 'SecurePass1',
      remember: false,
    }, 200);

    expect(loginResponse.body.user).not.toHaveProperty('passwordHash');

    const meResponse = await agent.get('/api/auth/me').expect(200);
    expect(meResponse.body.user).toMatchObject({
      email: 'login@example.com',
      username: 'LoginUser',
    });
    expect(meResponse.body.user).not.toHaveProperty('passwordHash');

    await postWithCsrf(agent, '/api/auth/logout', {}, 200);
    await agent.get('/api/auth/me').expect(401);
  });

  test('rejects invalid login credentials', async () => {
    await postWithCsrf(agent, '/api/auth/signup', {
      email: 'safe@example.com',
      username: 'SafeUser',
      password: 'SecurePass1',
      tandc: true,
    }, 201);

    await postWithCsrf(agent, '/api/auth/login', {
      username: 'safe@example.com',
      password: 'WrongPass1',
    }, 401);
  });

  test('requires authentication for the current-user endpoint', async () => {
    await request(app).get('/api/auth/me').expect(401);
  });

  test('serves the authentication frontend integrations', async () => {
    const loginPage = await request(app).get('/login.html').expect(200);
    expect(loginPage.text).toContain('/js/login.js');

    const signupPage = await request(app).get('/signup.html').expect(200);
    expect(signupPage.text).toContain('/js/signup.js');
  });
});
