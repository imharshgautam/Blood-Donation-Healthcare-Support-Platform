(() => {
  const searchForm = document.querySelector('.form-1');
  const searchInput = document.querySelector('#search-box');
  const driveCards = [...document.querySelectorAll('.drive-card')];
  if (!searchForm || !searchInput || !driveCards.length) return;

  let activeFilter = 'all';
  let query = new URLSearchParams(window.location.search).get('query') || '';
  searchInput.value = query;

  let savedData;
  try {
    savedData = window.PlatformStore.read();
  } catch (error) {
    savedData = { driveBookings: {} };
    window.PlatformStore.showToast(error.message);
  }
  const bookedSlots = savedData.driveBookings;
  let needsSave = false;

  driveCards.forEach((card) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const defaultOffset = Number(card.querySelector('[data-day-offset]')?.dataset.dayOffset || 0);
    const weekendOffset = (6 - date.getDay() + 7) % 7 || 7;
    const offset = card.dataset.driveCategory === 'weekend' ? weekendOffset : defaultOffset;
    date.setDate(date.getDate() + offset);
    const day = card.querySelector('.drive-day');
    const month = card.querySelector('.drive-month');
    if (day) day.textContent = String(date.getDate());
    if (month) month.textContent = date.toLocaleString(undefined, { month: 'short' }).toUpperCase();
    card.dataset.date = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      .map((value) => String(value).padStart(2, '0')).join('-');

    const slots = card.querySelector('[data-slots]');
    if (slots) {
      const driveName = card.querySelector('.drive-name')?.textContent || '';
      if (!Number.isInteger(bookedSlots[driveName])) {
        bookedSlots[driveName] = Number(slots.dataset.slots);
        needsSave = true;
      }
      const count = Number(bookedSlots[driveName]);
      slots.textContent = `${count} ${count === 1 ? 'Slot' : 'Slots'} Remaining`;
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== 'blood-donation-platform-v1') return;
    try {
      Object.keys(bookedSlots).forEach((driveName) => delete bookedSlots[driveName]);
      Object.assign(bookedSlots, window.PlatformStore.read().driveBookings);
      driveCards.forEach((card) => {
        const driveName = card.querySelector('.drive-name')?.textContent || '';
        const slotLabel = card.querySelector('[data-slots]');
        if (!slotLabel) return;
        const count = Number(bookedSlots[driveName] ?? slotLabel.dataset.slots);
        slotLabel.textContent = `${count} ${count === 1 ? 'Slot' : 'Slots'} Remaining`;
      });
    } catch (error) {
      window.PlatformStore.showToast(error.message);
    }
  });
  if (needsSave) {
    try {
      window.PlatformStore.update((data) => { data.driveBookings = bookedSlots; });
    } catch (error) {
      window.PlatformStore.showToast(error.message);
    }
  }

  const status = document.createElement('p');
  status.className = 'section-desc drive-search-status';
  status.setAttribute('role', 'status');
  document.querySelector('.drives-filter-tabs')?.after(status);

  function applyFilters() {
    const term = query.trim().toLowerCase();
    let visible = 0;
    driveCards.forEach((card) => {
      const matchesCategory = activeFilter === 'all'
        || card.dataset.driveCategory === activeFilter;
      const searchable = `${card.querySelector('.drive-name')?.textContent || ''} ${card.querySelector('.drive-location')?.textContent || ''}`.toLowerCase();
      const matchesQuery = !term || searchable.includes(term);
      card.hidden = !(matchesCategory && matchesQuery);
      if (!card.hidden) visible += 1;
    });
    status.textContent = `${visible} ${visible === 1 ? 'drive' : 'drives'} found.`;
  }

  document.querySelectorAll('[data-drive-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.driveFilter;
      document.querySelectorAll('[data-drive-filter]').forEach((tab) => {
        const selected = tab === button;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-pressed', String(selected));
      });
      applyFilters();
    });
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    query = searchInput.value;
    applyFilters();
    document.querySelector('#drives')?.scrollIntoView({ behavior: 'smooth' });
    if (!driveCards.some((card) => !card.hidden)) window.PlatformStore.showToast('No drives matched that search. Try another location or camp name.');
  });

  searchInput.addEventListener('input', () => {
    if (!searchInput.value.trim()) {
      query = '';
      applyFilters();
    }
  });

  document.querySelectorAll('[data-book-drive]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const card = link.closest('.drive-card');
      const driveName = link.dataset.bookDrive;
      const countElement = card?.querySelector('[data-slots]');
      const remaining = Number(bookedSlots[driveName] ?? countElement?.dataset.slots ?? 0);
      if (remaining <= 0) {
        event.preventDefault();
        window.PlatformStore.showToast('This drive is fully booked. Please choose another drive.');
        return;
      }

      const destination = new URL(link.href, window.location.href);
      destination.searchParams.set('drive', driveName);
      if (card?.dataset.date) destination.searchParams.set('date', card.dataset.date);
      event.preventDefault();
      window.location.assign(destination.href);
    });
  });

  applyFilters();
})();
