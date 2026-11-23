# Blood Donation Healthcare Support Platform

The website is a vanilla HTML, CSS, and JavaScript frontend. Its interactive
features use browser storage and do not require an API, database, or application
server. Open `pages/index.html` in a browser, or host the repository as static
files.

## Frontend features

- Account signup, sign-in, and local demo password reset.
- Donor registration, appointment booking, and emergency blood requests.
- Donation-drive search, filters, and slot availability.
- Admin donor/request/appointment CRUD, inventory updates, reports, and CSV export.
- Theme preference, dismissible alerts, accordions, and modals.

## Demo data and privacy

Records are stored in this browser using `localStorage` (sign-in sessions can be
temporary or remembered). Passwords are hashed in the browser, but this is only
a local demonstration—not secure authentication or a substitute for a backend.
Form submissions and uploaded proof filenames stay on the device; files are not
uploaded, email is not sent, and emergency requests do not contact donors,
hospitals, or emergency services. Do not enter real patient or donor information
or use the demo to coordinate medical care. Clear this site's browser storage to
remove saved demo records.
