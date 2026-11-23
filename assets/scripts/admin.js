function sampleDate(offset, time = '') {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  const label = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  return `${label}${time ? `, ${time}` : `, ${date.getFullYear()}`}`;
}

const seedData = {
  donors: [
    {
      id: 1,
      name: 'Sofia Bennett',
      email: 'sofia.b@email.com',
      blood: 'O+',
      location: 'North District',
      lastDonation: sampleDate(-30),
      status: 'Available',
    },
    {
      id: 2,
      name: 'Marcus Chen',
      email: 'marcus.chen@email.com',
      blood: 'A-',
      location: 'Westside',
      lastDonation: sampleDate(-32),
      status: 'Available',
    },
    {
      id: 3,
      name: 'Priya Sharma',
      email: 'priya.s@email.com',
      blood: 'B+',
      location: 'Central',
      lastDonation: sampleDate(-34),
      status: 'Available',
    },
    {
      id: 4,
      name: 'Daniel Rivera',
      email: 'daniel.r@email.com',
      blood: 'AB+',
      location: 'East District',
      lastDonation: sampleDate(-36),
      status: 'On hold',
    },
    {
      id: 5,
      name: 'Amara Johnson',
      email: 'amara.j@email.com',
      blood: 'O-',
      location: 'North District',
      lastDonation: sampleDate(-38),
      status: 'Available',
    },
    {
      id: 6,
      name: 'Oliver Park',
      email: 'oliver.park@email.com',
      blood: 'A+',
      location: 'Southside',
      lastDonation: sampleDate(-40),
      status: 'Available',
    },
    {
      id: 7,
      name: 'Nina Patel',
      email: 'nina.p@email.com',
      blood: 'B-',
      location: 'Central',
      lastDonation: sampleDate(-42),
      status: 'Available',
    },
    {
      id: 8,
      name: 'Ethan Brooks',
      email: 'ethan.b@email.com',
      blood: 'O+',
      location: 'Westside',
      lastDonation: sampleDate(-44),
      status: 'Available',
    },
  ],
  requests: [
    {
      id: 'BR-2048',
      patient: 'Liam Foster',
      facility: 'St. Mary Medical Center',
      blood: 'O-',
      units: 3,
      needed: 'Today, 2:30 PM',
      status: 'Critical',
    },
    {
      id: 'BR-2047',
      patient: 'Isabella Reed',
      facility: 'Northside General',
      blood: 'A+',
      units: 2,
      needed: 'Today, 4:00 PM',
      status: 'Matched',
    },
    {
      id: 'BR-2046',
      patient: 'Noah Campbell',
      facility: 'City Children’s Hospital',
      blood: 'B-',
      units: 1,
      needed: sampleDate(1, '9:00 AM'),
      status: 'Pending',
    },
    {
      id: 'BR-2045',
      patient: 'Mia Thompson',
      facility: 'St. Mary Medical Center',
      blood: 'AB+',
      units: 2,
      needed: sampleDate(1, '11:30 AM'),
      status: 'In progress',
    },
    {
      id: 'BR-2044',
      patient: 'Elijah Wilson',
      facility: 'Riverside Clinic',
      blood: 'O+',
      units: 4,
      needed: sampleDate(1, '1:00 PM'),
      status: 'Pending',
    },
    {
      id: 'BR-2043',
      patient: 'Ava Martinez',
      facility: 'Northside General',
      blood: 'A-',
      units: 1,
      needed: sampleDate(2, '8:00 AM'),
      status: 'Matched',
    },
  ],
  inventory: [
    { blood: 'O−', units: 8, capacity: 40, group: 'O-' },
    { blood: 'O+', units: 32, capacity: 40, group: 'O+' },
    { blood: 'A−', units: 12, capacity: 32, group: 'A-' },
    { blood: 'A+', units: 26, capacity: 36, group: 'A+' },
    { blood: 'B−', units: 6, capacity: 24, group: 'B-' },
    { blood: 'B+', units: 18, capacity: 30, group: 'B+' },
    { blood: 'AB−', units: 4, capacity: 16, group: 'AB-' },
    { blood: 'AB+', units: 11, capacity: 22, group: 'AB+' },
  ],
  appointments: [
    {
      id: 'AP-561',
      donor: 'Sofia Bennett',
      blood: 'O+',
      location: 'Central Donation Center',
      date: sampleDate(0, '10:30 AM'),
      status: 'Scheduled',
    },
    {
      id: 'AP-560',
      donor: 'Marcus Chen',
      blood: 'A-',
      location: 'Westside Mobile Unit',
      date: sampleDate(0, '11:00 AM'),
      status: 'Checked in',
    },
    {
      id: 'AP-559',
      donor: 'Priya Sharma',
      blood: 'B+',
      location: 'Central Donation Center',
      date: sampleDate(0, '12:15 PM'),
      status: 'Scheduled',
    },
    {
      id: 'AP-558',
      donor: 'Amara Johnson',
      blood: 'O-',
      location: 'North District Clinic',
      date: sampleDate(0, '1:00 PM'),
      status: 'Completed',
    },
    {
      id: 'AP-557',
      donor: 'Oliver Park',
      blood: 'A+',
      location: 'Southside Community Hall',
      date: sampleDate(0, '2:30 PM'),
      status: 'Scheduled',
    },
  ],
};

const storageKey = 'bloodlink-admin-data-v1';
let state;
let storageWarning = '';
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  state =
    saved &&
    Array.isArray(saved.donors) &&
    Array.isArray(saved.requests) &&
    Array.isArray(saved.inventory) &&
    Array.isArray(saved.appointments)
      ? saved
      : structuredClone(seedData);
} catch (error) {
  state = structuredClone(seedData);
  storageWarning = 'Saved admin data could not be read; the sample records are shown.';
}
state.preferences = state.preferences || { critical: true, lowStock: true, dailySummary: false };
state.deletedSources = state.deletedSources || [];

function mergePlatformRecords(platformData) {
  (platformData.donors || []).forEach((donor) => {
    if (
      !state.deletedSources.includes(donor.id) &&
      !state.donors.some((item) => item.sourceId === donor.id)
    ) {
      state.donors.push({
        ...donor,
        id: `WEB-${String(donor.id).slice(0, 8)}`,
        sourceId: donor.id,
        lastDonation: 'No donations yet',
        status: donor.status || 'Available',
      });
    }
  });
  (platformData.requests || []).forEach((request) => {
    if (
      !state.deletedSources.includes(request.id) &&
      !state.requests.some((item) => item.sourceId === request.id)
    ) {
      state.requests.unshift({
        ...request,
        id: `WEB-${String(request.id).slice(0, 8)}`,
        sourceId: request.id,
        status: request.status || 'Pending',
      });
    }
  });
  (platformData.appointments || []).forEach((appointment) => {
    if (
      !state.deletedSources.includes(appointment.id) &&
      !state.appointments.some((item) => item.sourceId === appointment.id)
    ) {
      state.appointments.unshift({
        ...appointment,
        id: `WEB-${String(appointment.id).slice(0, 8)}`,
        sourceId: appointment.id,
      });
    }
  });
}

try {
  mergePlatformRecords(JSON.parse(localStorage.getItem('blood-donation-platform-v1') || '{}'));
} catch (error) {
  storageWarning = 'Public form submissions could not be read from browser storage.';
}

const pageContent = document.querySelector('#page-content');
const modalBackdrop = document.querySelector('#modal-backdrop');
const formFields = document.querySelector('#form-fields');
const toastElement = document.querySelector('#toast');
let currentPage = 'dashboard';
let currentQuery = '';
let dashboardPeriod = 'This month';
let toastTimer;
let modalMode = '';
let modalRecord = null;
let pendingGlobalQuery = null;

const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  );

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    return true;
  } catch (error) {
    showToast(
      'This change could not be saved in browser storage. Check available storage and try again.',
    );
    return false;
  }
}

function icon(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function statusPill(status) {
  const className = status.toLowerCase().replace(/\s+/g, '-');
  return `<span class="status-pill status-${className}">${escapeHtml(status)}</span>`;
}

function personCell(name, detail, initials) {
  return `<div class="person-cell"><span class="person-avatar">${escapeHtml(
    initials ||
      name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join(''),
  )}</span><span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(detail)}</small></span></div>`;
}

function pageHeading(title, subtitle, actions = '') {
  return `<div class="page-heading"><div><span class="eyebrow">BLOODLINK / OPERATIONS</span><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;
}

function sectionLink(page, label) {
  return `<a class="text-link" href="#${page}" data-page="${page}">${label} ${icon('arrow')}</a>`;
}

function statCard(label, value, change, foot, iconName, color, down = false) {
  return `<article class="stat-card"><div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon ${color}">${icon(iconName)}</span></div><div class="stat-value-row"><strong class="stat-value">${value}</strong><span class="stat-change ${down ? 'down' : ''}">${change}</span></div><div class="stat-foot">${foot}</div></article>`;
}

function getActivity() {
  return [
    { blood: 'O−', facility: 'St. Mary Medical Center', when: '8 min ago', units: '3 units' },
    { blood: 'A+', facility: 'Northside General', when: '24 min ago', units: '2 units' },
    { blood: 'B−', facility: 'City Children’s Hospital', when: '46 min ago', units: '1 unit' },
    { blood: 'AB+', facility: 'Riverside Clinic', when: '1 hr ago', units: '2 units' },
  ];
}

function renderChart() {
  const series = {
    'This month': {
      donations: [32, 45, 37, 57, 48, 69, 54, 75, 58, 84, 67, 91],
      requests: [26, 34, 29, 42, 37, 53, 46, 61, 52, 70, 57, 77],
      labels: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23'],
    },
    'Last 30 days': {
      donations: [28, 41, 36, 52, 47, 63, 55, 71, 62, 79, 74, 88],
      requests: [24, 31, 28, 40, 35, 49, 45, 58, 50, 66, 60, 73],
      labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28', '30', ''],
    },
    'This quarter': {
      donations: [35, 48, 42, 60, 53, 72, 65, 81, 70, 89, 78, 96],
      requests: [29, 37, 33, 47, 41, 58, 51, 66, 57, 75, 66, 82],
      labels: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23'],
    },
  };
  const { donations, requests, labels } = series[dashboardPeriod];
  return `<div class="chart-wrap"><div class="chart-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div class="chart-area">${donations.map((value, index) => `<div class="chart-group"><span class="chart-bar primary" style="height:${value}%" title="${value} donations"></span><span class="chart-bar" style="height:${requests[index]}%" title="${requests[index]} requests"></span><span class="chart-label">${labels[index]}</span></div>`).join('')}</div></div>`;
}

function inventoryRows(compact = false) {
  return state.inventory
    .slice(0, compact ? 6 : state.inventory.length)
    .map((item) => {
      const percent = Math.min(100, Math.round((item.units / item.capacity) * 100));
      return `<div class="inventory-row"><span class="blood-type">${escapeHtml(item.blood)}</span><div class="inventory-level"><span class="${percent < 30 ? 'low' : ''}" style="width:${percent}%"></span></div><span class="inventory-units">${item.units} units</span><button class="icon-button inventory-edit" data-edit-stock="${escapeHtml(item.group)}" title="Update ${escapeHtml(item.blood)} stock" aria-label="Update ${escapeHtml(item.blood)} stock">${icon('more')}</button></div>`;
    })
    .join('');
}

function dashboardPage() {
  const recent = state.requests.slice(0, 4);
  const lowStock = state.inventory.filter((item) => item.units / item.capacity < 0.3);
  const month = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(
    new Date(),
  );
  return `${pageHeading('Operations overview', 'Here’s what’s happening across your donation network today.', `<select class="period-select" id="dashboard-period" aria-label="Reporting period">${['This month', 'Last 30 days', 'This quarter'].map((period) => `<option${period === dashboardPeriod ? ' selected' : ''}>${period}</option>`).join('')}</select><button class="button button-primary" data-action="new-request">${icon('plus')} New request</button>`)}
    <section class="stats-grid" aria-label="Network summary">
      ${statCard('Registered donors', state.donors.length.toLocaleString(), '+8.2%', 'vs. last month', 'users', 'red')}
      ${statCard('Donations this month', '1,284', '+12.5%', 'vs. last month', 'heart', 'green')}
      ${statCard('Open requests', state.requests.filter((item) => item.status !== 'Completed').length, '3 critical', 'needs attention today', 'drop', 'amber', true)}
      ${statCard('Lives supported', '3,642', '+16.3%', 'year to date', 'chart', 'blue')}
    </section>
    <section class="dashboard-grid">
      <div class="column-stack">
        <article class="panel chart-panel"><div class="panel-header"><div><h2 class="panel-title">Donation activity</h2><p class="panel-subtitle">${dashboardPeriod} · ${month}</p></div><div class="chart-legend"><span class="legend-item"><i class="legend-dot"></i>Donations</span><span class="legend-item"><i class="legend-dot secondary"></i>Requests</span></div></div>${renderChart()}</article>
        <article class="panel"><div class="panel-header"><div><h2 class="panel-title">Recent blood requests</h2><p class="panel-subtitle">Latest requests from partner facilities</p></div>${sectionLink('requests', 'View all')}</div><div class="table-scroll"><table><thead><tr><th>REQUEST</th><th>BLOOD TYPE</th><th>UNITS</th><th>NEEDED BY</th><th>STATUS</th></tr></thead><tbody>${recent.map((request) => `<tr><td><span class="request-name">${escapeHtml(request.id)} <span style="color:#9ba29e;font-weight:400">${escapeHtml(request.patient)}</span></span></td><td><span class="blood-type">${escapeHtml(request.blood)}</span></td><td>${request.units}</td><td>${escapeHtml(request.needed)}</td><td>${statusPill(request.status)}</td></tr>`).join('')}</tbody></table></div><div class="table-footer"><span>Showing ${recent.length} of ${state.requests.length} requests</span><span>Updated just now</span></div></article>
      </div>
      <div class="column-stack">
        <article class="panel"><div class="panel-header"><div><h2 class="panel-title">Blood inventory</h2><p class="panel-subtitle">Current stock across all centers</p></div>${sectionLink('inventory', 'Manage')}</div><div class="inventory-list">${inventoryRows(true)}</div>${lowStock.length ? `<div class="alert-banner"><span class="alert-mark">!</span><div class="alert-copy"><strong>${lowStock.length} blood type${lowStock.length === 1 ? '' : 's'} running low</strong><p>${lowStock.map((item) => escapeHtml(item.blood)).join(', ')} stock is below the recommended level.</p></div></div>` : ''}</article>
        <article class="panel activity-panel"><div class="panel-header"><div><h2 class="panel-title">Live request activity</h2><p class="panel-subtitle">Network-wide · updated in real time</p></div><span class="date-dot" title="Live"></span></div><div class="activity-list">${getActivity()
          .map(
            (item) =>
              `<div class="activity-row"><span class="blood-type">${item.blood}</span><div class="activity-copy"><strong>${item.facility}</strong><small>${item.when}</small></div><span class="activity-units">${item.units}</span></div>`,
          )
          .join('')}</div></article>
      </div>
    </section>`;
}

function tableShell(title, subtitle, headers, rows, options = {}) {
  const search = `<label class="table-search">${icon('search')}<input type="search" id="table-search" placeholder="${options.searchPlaceholder || 'Search records...'}" value="${escapeHtml(currentQuery)}" /></label>`;
  const filters = options.filters ? `<div class="toolbar-filters">${options.filters}</div>` : '';
  return `<article class="panel data-page-panel"><div class="panel-header"><div><h2 class="panel-title">${title}</h2><p class="panel-subtitle">${subtitle}</p></div>${options.headerAction || ''}</div><div class="toolbar-row">${search}${filters}</div><div class="table-scroll"><table class="data-table"><thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead><tbody id="records-body">${rows || ''}</tbody></table></div><div class="table-footer"><span>${options.footer || ''}</span><span>Saved in this browser</span></div></article>`;
}

function donorRows(query = '', group = 'all', status = 'all') {
  const filtered = state.donors.filter((donor) => {
    const matchesText =
      `${donor.name} ${donor.email} ${donor.location} ${donor.blood} ${donor.status} ${donor.lastDonation}`
        .toLowerCase()
        .includes(query.toLowerCase());
    return (
      matchesText &&
      (group === 'all' || donor.blood === group) &&
      (status === 'all' || donor.status === status)
    );
  });
  if (!filtered.length)
    return '<tr><td colspan="6" class="empty-state">No donors match your search.</td></tr>';
  return filtered
    .map(
      (donor) =>
        `<tr><td>${personCell(donor.name, donor.email)}</td><td><span class="blood-type">${escapeHtml(donor.blood)}</span></td><td>${escapeHtml(donor.location)}</td><td>${escapeHtml(donor.lastDonation)}</td><td>${statusPill(donor.status)}</td><td class="row-actions"><button class="button button-quiet" data-edit-record="donors" data-record-id="${escapeHtml(donor.id)}">Edit</button><button class="button button-quiet" data-delete-record="donors" data-record-id="${escapeHtml(donor.id)}">Delete</button></td></tr>`,
    )
    .join('');
}

function donorsPage() {
  return `${pageHeading('Donors', 'Manage registered donors and their availability.', `<button class="button button-quiet" data-action="export-donors">${icon('download')} Export</button><button class="button button-primary" data-action="new-donor">${icon('plus')} Add donor</button>`)}
    ${tableShell('Donor directory', `${state.donors.length} registered donors`, ['DONOR', 'BLOOD TYPE', 'LOCATION', 'LAST DONATION', 'STATUS', 'ACTIONS'], donorRows(currentQuery), { filters: `<select class="filter-select" id="donor-group-filter"><option value="all">All blood types</option>${bloodOptions()}</select><select class="filter-select" id="donor-status-filter"><option value="all">All statuses</option><option>Available</option><option>On hold</option></select>`, footer: `Showing ${state.donors.length} donors`, searchPlaceholder: 'Name, email or location' })}`;
}

function bloodOptions() {
  return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
    .map((group) => `<option value="${group}">${group.replace('-', '−')}</option>`)
    .join('');
}

function requestRows(query = '', status = 'all') {
  const filtered = state.requests.filter(
    (request) =>
      `${request.id} ${request.patient} ${request.facility} ${request.blood} ${request.status} ${request.needed}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === 'all' || request.status.toLowerCase() === status.toLowerCase()),
  );
  if (!filtered.length)
    return '<tr><td colspan="7" class="empty-state">No requests match your filters.</td></tr>';
  return filtered
    .map(
      (request) =>
        `<tr><td><strong>${escapeHtml(request.id)}</strong></td><td>${personCell(request.patient, request.facility)}</td><td><span class="blood-type">${escapeHtml(request.blood)}</span></td><td>${Number(request.units)}</td><td>${escapeHtml(request.needed)}</td><td>${statusPill(request.status)}</td><td class="row-actions"><button class="button button-quiet" data-edit-record="requests" data-record-id="${escapeHtml(request.id)}">Edit</button><button class="button button-quiet" data-delete-record="requests" data-record-id="${escapeHtml(request.id)}">Delete</button></td></tr>`,
    )
    .join('');
}

function requestsPage() {
  return `${pageHeading('Blood requests', 'Triage and coordinate requests from hospitals and care teams.', `<button class="button button-quiet" data-action="export-requests">${icon('download')} Export</button><button class="button button-primary" data-action="new-request">${icon('plus')} New request</button>`)}
    ${tableShell('Request queue', `${state.requests.length} requests in the network`, ['ID', 'PATIENT & FACILITY', 'BLOOD TYPE', 'UNITS', 'NEEDED BY', 'STATUS', 'ACTIONS'], requestRows(currentQuery), { filters: `<select class="filter-select" id="request-status-filter"><option value="all">All statuses</option><option>Critical</option><option>Pending</option><option>Matched</option><option>In progress</option><option>Completed</option></select>`, footer: `Showing ${state.requests.length} requests`, searchPlaceholder: 'Patient, facility or request ID' })}`;
}

function inventoryPage() {
  const totalUnits = state.inventory.reduce((sum, item) => sum + item.units, 0);
  const lowTypes = state.inventory.filter((item) => item.units / item.capacity < 0.3).length;
  const rows = inventoryTableRows(currentQuery);
  return `${pageHeading('Blood inventory', 'Monitor supply levels and keep every donation center ready.', `<button class="button button-quiet" data-action="export-inventory">${icon('download')} Export</button>`)}
    <section class="inventory-summary"><article class="mini-stat"><span>Total units in stock</span><strong>${totalUnits}</strong></article><article class="mini-stat"><span>Blood groups tracked</span><strong>${state.inventory.length}</strong></article><article class="mini-stat"><span>Groups below threshold</span><strong style="color:${lowTypes ? 'var(--red)' : 'var(--green)'}">${lowTypes}</strong></article></section>
    ${tableShell('Stock by blood type', 'Available units across all donation centers', ['BLOOD TYPE', 'STOCK LEVEL', 'AVAILABLE', 'CAPACITY', 'STATUS', 'ACTION'], rows, { footer: `${totalUnits} units available` })}`;
}

function inventoryTableRows(query = '') {
  const filtered = state.inventory.filter((item) =>
    `${item.blood} ${item.group} ${item.units < item.capacity * 0.3 ? 'low stock' : 'available'}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  if (!filtered.length)
    return '<tr><td colspan="6" class="empty-state">No inventory records match your search.</td></tr>';
  return filtered
    .map((item) => {
      const percent = Math.min(100, Math.round((item.units / item.capacity) * 100));
      return `<tr><td><span class="blood-type">${escapeHtml(item.blood)}</span></td><td><div class="stock-cell"><div class="inventory-level"><span class="${percent < 30 ? 'low' : ''}" style="width:${percent}%"></span></div><span>${percent}%</span></div></td><td><strong>${item.units}</strong> units</td><td>${item.capacity} units</td><td>${statusPill(percent < 30 ? 'Low stock' : 'Available')}</td><td><button class="button button-quiet" data-edit-stock="${escapeHtml(item.group)}">Update</button></td></tr>`;
    })
    .join('');
}

function appointmentRows(query = '', status = 'all') {
  const filtered = state.appointments.filter(
    (appointment) =>
      `${appointment.id} ${appointment.donor} ${appointment.location} ${appointment.blood} ${appointment.date} ${appointment.status}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === 'all' || appointment.status.toLowerCase() === status.toLowerCase()),
  );
  if (!filtered.length)
    return '<tr><td colspan="6" class="empty-state">No appointments match your filters.</td></tr>';
  return filtered
    .map(
      (appointment) =>
        `<tr><td><strong>${escapeHtml(appointment.id)}</strong></td><td>${personCell(appointment.donor, appointment.location)}</td><td><span class="blood-type">${escapeHtml(appointment.blood)}</span></td><td>${escapeHtml(appointment.date)}</td><td>${statusPill(appointment.status)}</td><td class="row-actions"><button class="button button-quiet" data-edit-record="appointments" data-record-id="${escapeHtml(appointment.id)}">Edit</button><button class="button button-quiet" data-delete-record="appointments" data-record-id="${escapeHtml(appointment.id)}">Delete</button></td></tr>`,
    )
    .join('');
}

function appointmentsPage() {
  return `${pageHeading('Appointments', 'Coordinate donor visits and collection center schedules.', `<button class="button button-primary" data-action="new-appointment">${icon('plus')} Schedule appointment</button>`)}
    ${tableShell('Appointment schedule', `${state.appointments.length} appointments today`, ['ID', 'DONOR & LOCATION', 'BLOOD TYPE', 'DATE & TIME', 'STATUS', 'ACTIONS'], appointmentRows(currentQuery), { filters: `<select class="filter-select" id="appointment-status-filter"><option value="all">All statuses</option><option>Scheduled</option><option>Checked in</option><option>Completed</option></select>`, footer: `${state.appointments.length} appointments`, searchPlaceholder: 'Donor or location' })}`;
}

function reportsPage() {
  const totalUnits = state.inventory.reduce((sum, item) => sum + item.units, 0);
  return `${pageHeading('Reports & analytics', 'A snapshot of donation network health and impact.', `<button class="button button-quiet" data-action="export-requests">${icon('download')} Export data</button>`)}
    <section class="report-grid"><article class="report-card"><span class="eyebrow">DONOR GROWTH</span><h3>Donor registrations</h3><p>New donors joined the network this month. Registration is up across all districts.</p><span class="report-metric">+8.2% vs. September</span></article><article class="report-card"><span class="eyebrow">FULFILLMENT</span><h3>Request match rate</h3><p>Requests matched with eligible donors before their required time.</p><span class="report-metric">91.4% match rate</span></article><article class="report-card"><span class="eyebrow">SUPPLY</span><h3>Current inventory</h3><p>${totalUnits} units are available across eight blood groups in the network.</p><span class="report-metric">${state.inventory.filter((item) => item.units / item.capacity < 0.3).length} groups need replenishment</span></article><article class="report-card"><span class="eyebrow">COMMUNITY IMPACT</span><h3>Lives supported</h3><p>Every successful donation can support up to three patients in need.</p><span class="report-metric">3,642 people this year</span></article></section>`;
}

function settingsPage() {
  return `${pageHeading('Settings', 'Manage workspace preferences and notification defaults.')}
    <section class="settings-layout"><nav class="settings-tabs" aria-label="Settings sections">${Object.keys(
      settingsTabs,
    )
      .map(
        (tab) =>
          `<button class="settings-tab${tab === 'Workspace' ? ' active' : ''}" type="button">${tab}</button>`,
      )
      .join(
        '',
      )}</nav><article class="settings-content"><h2>${settingsTabs.Workspace[0]}</h2><p>${settingsTabs.Workspace[1]}</p><div class="settings-row"><div><strong>Critical request alerts</strong><small>Notify the network team when a critical request arrives.</small></div><button class="toggle${state.preferences.critical ? ' on' : ''}" data-preference="critical" aria-label="Toggle critical request alerts" aria-pressed="${state.preferences.critical}"></button></div><div class="settings-row"><div><strong>Low inventory notifications</strong><small>Get notified when blood stock falls below 30% capacity.</small></div><button class="toggle${state.preferences.lowStock ? ' on' : ''}" data-preference="lowStock" aria-label="Toggle low inventory notifications" aria-pressed="${state.preferences.lowStock}"></button></div><div class="settings-row"><div><strong>Daily operations summary</strong><small>Receive a daily summary of donations and open requests.</small></div><button class="toggle${state.preferences.dailySummary ? ' on' : ''}" data-preference="dailySummary" aria-label="Toggle daily operations summary" aria-pressed="${state.preferences.dailySummary}"></button></div></article></section>`;
}

const pages = {
  dashboard: dashboardPage,
  donors: donorsPage,
  requests: requestsPage,
  inventory: inventoryPage,
  appointments: appointmentsPage,
  reports: reportsPage,
  settings: settingsPage,
};
const pageTitles = {
  dashboard: 'Overview',
  donors: 'Donors',
  requests: 'Blood requests',
  inventory: 'Inventory',
  appointments: 'Appointments',
  reports: 'Reports',
  settings: 'Settings',
};
const settingsTabs = {
  Workspace: ['Workspace preferences', 'Configure how BloodLink works for your care network.'],
  Notifications: ['Notification preferences', 'Choose which operational updates are enabled.'],
  'Team access': [
    'Team access',
    'This local demo has one administrator profile and no shared access controls.',
  ],
  'Data & privacy': [
    'Data & privacy',
    'Demo records stay in this browser. Clearing site storage removes them.',
  ],
};

function updateNavigation() {
  document.querySelectorAll('.nav-link[data-page]').forEach((link) => {
    link.classList.toggle('active', link.dataset.page === currentPage);
  });
  document.querySelector('#breadcrumb-page').textContent = pageTitles[currentPage] || 'Overview';
  document.querySelector('#donor-count').textContent = state.donors.length;
  const openCount = state.requests.filter((request) => request.status !== 'Completed').length;
  document.querySelector('.alert-count').textContent = openCount;
}

function renderPage() {
  currentPage = location.hash.slice(1) || 'dashboard';
  if (!pages[currentPage]) currentPage = 'dashboard';
  updateNavigation();
  pageContent.innerHTML = pages[currentPage]();
  document.querySelector('.date-chip span:last-child').textContent = new Intl.DateTimeFormat(
    undefined,
    {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  ).format(new Date());
  if (currentPage === 'donors') applyDonorFilters();
  if (currentPage === 'requests') applyRequestFilters();
  if (currentPage === 'inventory') applyInventoryFilters();
  if (currentPage === 'appointments') applyAppointmentFilters();
}

function applyDonorFilters() {
  const body = document.querySelector('#records-body');
  if (!body) return;
  const group = document.querySelector('#donor-group-filter')?.value || 'all';
  const status = document.querySelector('#donor-status-filter')?.value || 'all';
  body.innerHTML = donorRows(currentQuery, group, status);
  updateFilteredCount('donors', 'donors');
}

function applyRequestFilters() {
  const body = document.querySelector('#records-body');
  if (body) {
    body.innerHTML = requestRows(
      currentQuery,
      document.querySelector('#request-status-filter')?.value || 'all',
    );
    updateFilteredCount('requests', 'requests');
  }
}

function applyInventoryFilters() {
  const body = document.querySelector('#records-body');
  if (body) {
    body.innerHTML = inventoryTableRows(currentQuery);
    updateFilteredCount('inventory', 'inventory records');
  }
}

function applyAppointmentFilters() {
  const body = document.querySelector('#records-body');
  if (body) {
    body.innerHTML = appointmentRows(
      currentQuery,
      document.querySelector('#appointment-status-filter')?.value || 'all',
    );
    updateFilteredCount('appointments', 'appointments');
  }
}

function updateFilteredCount(collection, label) {
  const body = document.querySelector('#records-body');
  const count = document.querySelector('.table-footer span:first-child');
  if (!body || !count) return;
  const visible = body.querySelector('.empty-state') ? 0 : body.querySelectorAll('tr').length;
  count.textContent = `Showing ${visible} of ${state[collection].length} ${label}`;
}

const field = (
  name,
  label,
  type = 'text',
  options = [],
  full = false,
  required = true,
  attributes = '',
) => {
  const control =
    type === 'select'
      ? `<select name="${name}" ${required ? 'required' : ''}>${options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join('')}</select>`
      : `<input name="${name}" type="${type}" ${required ? 'required' : ''} ${attributes}/>`;
  return `<div class="form-field ${full ? 'full' : ''}"><label for="field-${name}">${label}</label>${control.replace(`name="${name}"`, `id="field-${name}" name="${name}"`)}</div>`;
};

function openModal(mode, value = '') {
  modalMode = mode;
  modalRecord = null;
  if (mode === 'edit-donors' || mode === 'edit-requests' || mode === 'edit-appointments') {
    const collection = mode.replace('edit-', '');
    modalRecord = state[collection].find((record) => String(record.id) === String(value));
    if (!modalRecord) return showToast('That record could not be found.');
  }
  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((group) => ({
    value: group,
    label: group.replace('-', '−'),
  }));
  const definitions = {
    request: {
      title: 'Create blood request',
      eyebrow: 'NEW REQUEST',
      submit: 'Create request',
      fields: `${field('patient', 'Patient name')}${field('facility', 'Healthcare facility')}${field('blood', 'Blood type', 'select', bloodTypes)}${field('units', 'Units required', 'number', [], false, true, 'min="1" max="1000"')}${field('needed', 'Needed by', 'text', [], true)}`,
    },
    donor: {
      title: 'Add donor',
      eyebrow: 'NEW DONOR',
      submit: 'Add donor',
      fields: `${field('name', 'Full name')}${field('email', 'Email address', 'email')}${field('blood', 'Blood type', 'select', bloodTypes)}${field('location', 'District or location')}`,
    },
    stock: {
      title: `Update ${value.replace('-', '−')} stock`,
      eyebrow: 'INVENTORY UPDATE',
      submit: 'Save stock',
      fields: `${field(
        'blood',
        'Blood type',
        'select',
        state.inventory.map((item) => ({ value: item.group, label: item.blood })),
      )}${field('units', 'Units currently available', 'number', [], false, true, 'min="0" max="500"')}`,
    },
    appointment: {
      title: 'Schedule appointment',
      eyebrow: 'NEW APPOINTMENT',
      submit: 'Schedule appointment',
      fields: `${field('donor', 'Donor name')}${field('blood', 'Blood type', 'select', bloodTypes)}${field('location', 'Collection location', 'text', [], true)}${field('date', 'Date and time', 'text', [], true)}`,
    },
    'edit-donors': {
      title: 'Edit donor',
      eyebrow: 'UPDATE DONOR',
      submit: 'Save donor',
      fields: `${field('name', 'Full name')}${field('email', 'Email address', 'email')}${field('blood', 'Blood type', 'select', bloodTypes)}${field('location', 'District or location')}${field(
        'status',
        'Availability',
        'select',
        [
          { value: 'Available', label: 'Available' },
          { value: 'On hold', label: 'On hold' },
        ],
      )}`,
    },
    'edit-requests': {
      title: 'Edit blood request',
      eyebrow: 'UPDATE REQUEST',
      submit: 'Save request',
      fields: `${field('patient', 'Patient name')}${field('facility', 'Healthcare facility')}${field('blood', 'Blood type', 'select', bloodTypes)}${field('units', 'Units required', 'number', [], false, true, 'min="1" max="1000"')}${field('needed', 'Needed by', 'text', [], true)}${field(
        'status',
        'Request status',
        'select',
        ['Critical', 'Pending', 'Matched', 'In progress', 'Completed'].map((status) => ({
          value: status,
          label: status,
        })),
      )}`,
    },
    'edit-appointments': {
      title: 'Edit appointment',
      eyebrow: 'UPDATE APPOINTMENT',
      submit: 'Save appointment',
      fields: `${field('donor', 'Donor name')}${field('blood', 'Blood type', 'select', bloodTypes)}${field('location', 'Collection location', 'text', [], true)}${field('date', 'Date and time', 'text', [], true)}${field(
        'status',
        'Appointment status',
        'select',
        ['Scheduled', 'Checked in', 'Completed'].map((status) => ({
          value: status,
          label: status,
        })),
      )}`,
    },
  };
  const definition = definitions[mode];
  document.querySelector('#modal-title').textContent = definition.title;
  document.querySelector('#modal-eyebrow').textContent = definition.eyebrow;
  document.querySelector('#modal-submit').textContent = definition.submit;
  formFields.innerHTML = definition.fields;
  if (mode === 'stock') {
    document.querySelector('#field-blood').value = value;
    document.querySelector('#field-units').value =
      state.inventory.find((item) => item.group === value)?.units || 0;
    document.querySelector('#field-units').min = 0;
    document.querySelector('#field-units').max = 500;
  }
  if (mode === 'request' || mode === 'appointment')
    document.querySelector('#field-units')?.setAttribute('min', '1');
  if (modalRecord) {
    Object.entries(modalRecord).forEach(([name, fieldValue]) => {
      const input = document.querySelector(`#field-${name}`);
      if (input) input.value = fieldValue;
    });
  }
  modalBackdrop.hidden = false;
  document.querySelector('#field-patient, #field-name, #field-blood')?.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.querySelector('#record-form').reset();
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastElement.classList.remove('show'), 2600);
}

function exportCsv(collection) {
  const records = state[collection];
  if (!records?.length) return showToast('There are no records to export.');
  const headers = Object.keys(records[0]);
  const csv = [
    headers.join(','),
    ...records.map((record) =>
      headers.map((header) => `"${String(record[header] ?? '').replaceAll('"', '""')}"`).join(','),
    ),
  ].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `bloodlink-${collection}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`${records.length} ${collection} exported as CSV.`);
}

document.addEventListener('click', (event) => {
  const nav = event.target.closest('[data-page]');
  if (nav) {
    document.querySelector('#sidebar').classList.remove('open');
    document.querySelector('.mobile-overlay')?.classList.remove('show');
    return;
  }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'new-request') openModal('request');
  if (action === 'new-donor') openModal('donor');
  if (action === 'new-appointment') openModal('appointment');
  if (action === 'export-donors') exportCsv('donors');
  if (action === 'export-requests') exportCsv('requests');
  if (action === 'export-inventory') exportCsv('inventory');
  const editRecord = event.target.closest('[data-edit-record]');
  if (editRecord) openModal(`edit-${editRecord.dataset.editRecord}`, editRecord.dataset.recordId);
  const deleteRecord = event.target.closest('[data-delete-record]');
  if (deleteRecord) {
    const collection = deleteRecord.dataset.deleteRecord;
    const record = state[collection].find(
      (item) => String(item.id) === String(deleteRecord.dataset.recordId),
    );
    if (
      record &&
      window.confirm(
        `Delete ${record.name || record.patient || record.donor || record.id}? This cannot be undone.`,
      )
    ) {
      state[collection] = state[collection].filter((item) => String(item.id) !== String(record.id));
      if (record.sourceId) state.deletedSources.push(record.sourceId);
      if (saveState()) {
        showToast('Record deleted.');
        renderPage();
        if (storageWarning) showToast(storageWarning);
      }
    }
  }
  const stockButton = event.target.closest('[data-edit-stock]');
  if (stockButton) openModal('stock', stockButton.dataset.editStock);
  if (event.target.closest('#modal-close, #modal-cancel')) closeModal();
  if (event.target === modalBackdrop) closeModal();
  if (event.target.closest('.toggle')) {
    const toggle = event.target.closest('.toggle');
    toggle.classList.toggle('on');
    toggle.setAttribute('aria-pressed', toggle.classList.contains('on'));
    const preference = toggle.dataset.preference;
    if (preference) {
      state.preferences[preference] = toggle.classList.contains('on');
      if (saveState()) {
        showToast('Notification preference saved.');
      } else {
        toggle.classList.toggle('on');
        toggle.setAttribute('aria-pressed', String(toggle.classList.contains('on')));
        state.preferences[preference] = toggle.classList.contains('on');
      }
    }
  }
  if (event.target.closest('.settings-tab')) {
    document.querySelectorAll('.settings-tab').forEach((tab) => tab.classList.remove('active'));
    const tab = event.target.closest('.settings-tab');
    tab.classList.add('active');
    const [title, description] = settingsTabs[tab.textContent.trim()] || settingsTabs.Workspace;
    const content = document.querySelector('.settings-content');
    content.querySelector('h2').textContent = title;
    content.querySelector('p').textContent = description;
    content.querySelectorAll('.settings-row').forEach((row) => {
      row.hidden = !['Workspace', 'Notifications'].includes(tab.textContent.trim());
    });
    if (
      tab.textContent.trim() === 'Data & privacy' &&
      !content.querySelector('[data-reset-demo]')
    ) {
      const reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'button button-quiet';
      reset.dataset.resetDemo = '';
      reset.textContent = 'Restore sample records';
      content.append(reset);
    }
    const reset = content.querySelector('[data-reset-demo]');
    if (reset) reset.hidden = tab.textContent.trim() !== 'Data & privacy';
  }
  if (event.target.closest('[data-reset-demo]')) {
    if (
      window.confirm(
        'Restore the original sample records? Admin edits will be removed; public form submissions remain saved in this browser.',
      )
    ) {
      localStorage.removeItem(storageKey);
      window.location.hash = '#dashboard';
      window.location.reload();
    }
  }
  if (event.target.closest('.profile-menu'))
    showToast('Signed in as Alex Morgan · Network administrator (local demo profile).');
  if (event.target.closest('.sidebar-help'))
    showToast(
      'For real emergency support, contact your local hospital or emergency services. This demo does not dispatch requests.',
    );
  if (event.target.closest('#notification-button')) {
    const critical = state.requests.filter((request) => request.status === 'Critical').length;
    const low = state.inventory.filter((item) => item.units / item.capacity < 0.3).length;
    showToast(`${critical} critical blood requests and ${low} low-stock groups need attention.`);
  }
});

window.addEventListener('hashchange', () => {
  if (pendingGlobalQuery !== null) {
    currentQuery = pendingGlobalQuery;
    pendingGlobalQuery = null;
  } else {
    currentQuery = '';
    document.querySelector('#global-search').value = '';
  }
  renderPage();
});

window.addEventListener('storage', (event) => {
  if (event.key !== 'blood-donation-platform-v1') return;
  try {
    mergePlatformRecords(JSON.parse(event.newValue || '{}'));
    const saved = saveState();
    renderPage();
    if (saved) showToast('New public form records are now available.');
  } catch (error) {
    showToast('New public form records could not be loaded from browser storage.');
  }
});

document.addEventListener('input', (event) => {
  if (event.target.id === 'table-search') {
    currentQuery = event.target.value;
    document.querySelector('#global-search').value = currentQuery;
    if (currentPage === 'donors') applyDonorFilters();
    if (currentPage === 'requests') applyRequestFilters();
    if (currentPage === 'inventory') applyInventoryFilters();
    if (currentPage === 'appointments') applyAppointmentFilters();
  }
  if (event.target.id === 'global-search') {
    currentQuery = event.target.value;
    const tableSearch = document.querySelector('#table-search');
    if (tableSearch) tableSearch.value = currentQuery;
    if (currentPage === 'donors') applyDonorFilters();
    if (currentPage === 'requests') applyRequestFilters();
    if (currentPage === 'inventory') applyInventoryFilters();
    if (currentPage === 'appointments') applyAppointmentFilters();
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'donor-group-filter' || event.target.id === 'donor-status-filter')
    applyDonorFilters();
  if (event.target.id === 'request-status-filter') applyRequestFilters();
  if (event.target.id === 'appointment-status-filter') applyAppointmentFilters();
  if (event.target.id === 'dashboard-period') {
    dashboardPeriod = event.target.value;
    renderPage();
  }
});

document.querySelector('#record-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const values = Object.fromEntries(new FormData(event.currentTarget).entries());
  if (modalMode === 'request') {
    state.requests.unshift({
      id: `BR-${Date.now()}`,
      patient: values.patient.trim(),
      facility: values.facility.trim(),
      blood: values.blood,
      units: Number(values.units),
      needed: values.needed.trim(),
      status: 'Pending',
    });
    showToast('Blood request added to the queue.');
  }
  if (modalMode === 'donor') {
    if (
      state.donors.some((donor) => donor.email.toLowerCase() === values.email.trim().toLowerCase())
    ) {
      showToast('A donor with that email address already exists.');
      document.querySelector('#field-email').focus();
      return;
    }
    state.donors.unshift({
      id: `DN-${Date.now()}`,
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      blood: values.blood,
      location: values.location.trim(),
      lastDonation: 'No donations yet',
      status: 'Available',
    });
    showToast('Donor added to the directory.');
  }
  if (modalMode === 'stock') {
    const item = state.inventory.find((entry) => entry.group === values.blood);
    item.units = Number(values.units);
    showToast(`${item.blood} inventory updated.`);
  }
  if (modalMode === 'appointment') {
    state.appointments.unshift({
      id: `AP-${Date.now()}`,
      donor: values.donor.trim(),
      blood: values.blood,
      location: values.location.trim(),
      date: values.date.trim(),
      status: 'Scheduled',
    });
    showToast('Appointment scheduled.');
  }
  if (modalMode === 'edit-donors') {
    if (
      state.donors.some(
        (donor) =>
          donor !== modalRecord && donor.email.toLowerCase() === values.email.trim().toLowerCase(),
      )
    ) {
      showToast('A donor with that email address already exists.');
      document.querySelector('#field-email').focus();
      return;
    }
    Object.assign(modalRecord, {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      blood: values.blood,
      location: values.location.trim(),
      status: values.status,
    });
    showToast('Donor record updated.');
  }
  if (modalMode === 'edit-requests') {
    Object.assign(modalRecord, {
      patient: values.patient.trim(),
      facility: values.facility.trim(),
      blood: values.blood,
      units: Number(values.units),
      needed: values.needed.trim(),
      status: values.status,
    });
    showToast('Blood request updated.');
  }
  if (modalMode === 'edit-appointments') {
    Object.assign(modalRecord, {
      donor: values.donor.trim(),
      blood: values.blood,
      location: values.location.trim(),
      date: values.date.trim(),
      status: values.status,
    });
    showToast('Appointment updated.');
  }
  if (saveState()) {
    closeModal();
    renderPage();
  }
});

const sidebar = document.querySelector('#sidebar');
const overlay = document.createElement('div');
overlay.className = 'mobile-overlay';
document.body.append(overlay);
document.querySelector('#menu-toggle').addEventListener('click', () => {
  sidebar.classList.add('open');
  overlay.classList.add('show');
});
overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
});

document.querySelector('#global-search').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query = event.target.value.trim().toLowerCase();
    if (!query) return;
    const collections = [
      [
        'requests',
        state.requests,
        (record) =>
          `${record.id} ${record.patient} ${record.facility} ${record.blood} ${record.status} ${record.needed}`,
      ],
      [
        'donors',
        state.donors,
        (record) =>
          `${record.name} ${record.email} ${record.location} ${record.blood} ${record.status} ${record.lastDonation}`,
      ],
      [
        'appointments',
        state.appointments,
        (record) =>
          `${record.id} ${record.donor} ${record.location} ${record.blood} ${record.date} ${record.status}`,
      ],
      [
        'inventory',
        state.inventory,
        (record) =>
          `${record.blood} ${record.group} ${record.units} ${record.units < record.capacity * 0.3 ? 'low stock' : 'available'}`,
      ],
    ];
    const destination = collections.find(([, records, text]) =>
      records.some((record) => text(record).toLowerCase().includes(query)),
    );
    if (!destination) {
      showToast('No matching donors, requests, or appointments were found.');
      return;
    }
    pendingGlobalQuery = event.target.value;
    if (currentPage === destination[0]) {
      currentQuery = pendingGlobalQuery;
      if (currentPage === 'requests') applyRequestFilters();
      if (currentPage === 'donors') applyDonorFilters();
      if (currentPage === 'appointments') applyAppointmentFilters();
      if (currentPage === 'inventory') applyInventoryFilters();
      pendingGlobalQuery = null;
    } else {
      location.hash = `#${destination[0]}`;
    }
  }
  if (event.key === 'Escape') {
    event.target.value = '';
    currentQuery = '';
    renderPage();
  }
});

document.querySelector('.global-search').addEventListener('click', () => {
  if (window.matchMedia('(max-width: 560px)').matches) {
    document.querySelector('.global-search').classList.add('expanded');
    document.querySelector('#global-search').focus();
  }
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.querySelector('#global-search').focus();
  }
  if (event.key === 'Escape' && !modalBackdrop.hidden) closeModal();
  if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('.sidebar-help')) {
    event.preventDefault();
    event.target.closest('.sidebar-help').click();
  }
});

renderPage();
