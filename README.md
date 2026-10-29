# Blood Donation Healthcare Support Platform

## Admin portal

After configuring and starting the project server, open `http://localhost:3000/admin.html`.
The portal is implemented with plain HTML, CSS, and JavaScript.

The portal includes an operations overview, donor directory, blood request queue,
inventory, appointments, reports, and notification settings. It supports browser
search and filters, CSV exports, and local demo record updates.

### Demo data and privacy

The portal starts with illustrative sample records. Changes are saved in this
browser using `localStorage`; clearing the site's local storage restores the
original sample data. The portal is a frontend prototype with no server-backed
records, role-based access control, or admin authentication. Do not enter real
patient or donor information, and do not use it to coordinate live medical care.

BloodLink is a static admin portal for coordinating a blood donation network.

## Run

Open `index.html` in a browser. The portal uses plain HTML, CSS, and JavaScript and does not require a build step or package installation.

## Portal sections

- **Overview:** network activity, recent requests, and blood stock levels.
- **Donors:** searchable donor directory, blood-group and availability filters, donor entry, and CSV export.
- **Blood requests:** request queue, status filtering, request entry, and CSV export.
- **Inventory:** current stock by blood group with editable unit counts.
- **Appointments:** donor schedule and appointment entry.
- **Reports:** network summary metrics.
- **Settings:** workspace notification preferences.
