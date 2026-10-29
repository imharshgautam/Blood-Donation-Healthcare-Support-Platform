# Blood Donation Healthcare Support Platform

A Node.js, Express, MongoDB, and vanilla JavaScript blood-donation support platform.

## Authentication setup

### Prerequisites

- Node.js 18 or newer
- MongoDB 6 or newer (local or hosted)

### Install and configure

```sh
npm install
cp .env.example .env
```

Set the following values in `.env`:

- `MONGODB_URI`: the MongoDB connection string.
- `SESSION_SECRET`: a unique, random secret of at least 32 characters.
- `SESSION_MAX_AGE_MS`: session lifetime in milliseconds.
- `PORT`: HTTP port (default `3000`).
- `TRUST_PROXY`: hop count trusted only when running behind a proxy, or `0` otherwise.
- `NODE_ENV`: `development` locally and `production` in deployment.

Start the application:

```sh
npm start
```

Open `http://localhost:3000/login.html` or `http://localhost:3000/signup.html`. Production sessions are stored in MongoDB and cookies are Secure, HTTP-only, and `SameSite=Strict`. Deploy behind HTTPS and keep `SESSION_SECRET` confidential. Browser requests use credentials and a per-session CSRF token.

## Authentication API

- `POST /api/auth/signup` creates an account.
- `POST /api/auth/login` starts an authenticated session.
- `POST /api/auth/logout` destroys the session and clears its cookie.
- `GET /api/auth/me` returns the current safe user profile and requires authentication.
- `GET /api/auth/csrf` returns a CSRF token for state-changing requests.

State-changing authentication requests require `x-csrf-token` and use the HTTP-only session cookie. Signup accepts `email`, `username`, `password`, optional `confirmPassword`, and `tandc`.

## Tests

```sh
npm test
```

The Jest suite uses an isolated in-memory MongoDB server and Supertest to cover registration validation, duplicate accounts, password hashing, login/logout, protected users, safe responses, and frontend integration.

## Admin portal

After configuring and starting the project server, open `http://localhost:3000/admin.html`.
The portal is implemented with plain HTML, CSS, and JavaScript. It includes an
operations overview, donor directory, blood request queue, inventory, appointments,
reports, and notification settings. Search and filters, CSV exports, and local
demo record updates are available in the browser.

### Demo data and privacy

The portal starts with illustrative sample records. Changes are saved in this
browser using `localStorage`; clearing the site's local storage restores the
original sample data. The portal is a frontend prototype with no server-backed
records, role-based access control, or admin authentication. Do not enter real
patient or donor information, and do not use it to coordinate live medical care.
