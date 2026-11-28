# Blood Donation Healthcare Support Platform

A blood donation & healthcare support web application with a public donor/recipient portal, a BloodLink operations admin dashboard, and an Express API (`app.js` / `server.js`) ready for local hosting or Vercel deployment.

## How to run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Configure environment variables by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - `MONGODB_URI` is optional for running the frontend and operations portal locally; if MongoDB is not running or `MONGODB_URI` is omitted, the server starts with in-memory sessions and serves all frontend pages and `/api/health`.
   - `SESSION_SECRET` is recommended in production.
3. Start the server:
   ```bash
   npm start
   ```
   Or run with auto-reload during development:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser (Admin Operations Portal: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)).

## Running tests

```bash
npm test
```

## Deploying to Vercel

This repository is configured for Vercel's Express runtime (`Express`) with `vercel.json`:

1. Import the repository into Vercel (or run `vercel` via the Vercel CLI).
2. Add environment variables in Vercel Project Settings if you want MongoDB-backed `/api/auth` endpoints:
   - `MONGODB_URI`
   - `SESSION_SECRET`
3. Deploy — `vercel-build` copies `pages/` and `assets/` into `public/` for Vercel's CDN, `vercel.json` rewrites clean URLs (`/donate`, `/admin`, etc.), and Vercel wraps `app.js`/`server.js` for `/api/*`.

## Features

- Account signup, sign-in, and local demo password reset.
- Donor registration, appointment booking, and emergency blood requests.
- Donation-drive search, filters, and slot availability.
- Admin donor/request/appointment CRUD, inventory updates, reports, and CSV export (`pages/admin.html`).
- Theme preference, dismissible alerts, accordions, and modals.

## Demo data and privacy

Interactive frontend records are stored in this browser using `localStorage` (sign-in sessions can be temporary or remembered). Passwords in the browser demo are hashed client-side, which is only for local demonstration—not a substitute for server-backed authentication. Form submissions and uploaded proof filenames stay on the device; files are not uploaded, email is not sent, and emergency requests do not contact donors, hospitals, or emergency services. Do not enter real patient or donor information or use the demo to coordinate medical care. Clear this site's browser storage to remove saved demo records.
