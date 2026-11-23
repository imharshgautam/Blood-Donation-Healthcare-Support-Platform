(() => {
  const storageKey = 'blood-donation-platform-v1';

  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return {
        users: Array.isArray(saved.users) ? saved.users : [],
        donors: Array.isArray(saved.donors) ? saved.donors : [],
        requests: Array.isArray(saved.requests) ? saved.requests : [],
        appointments: Array.isArray(saved.appointments) ? saved.appointments : [],
        driveBookings: saved.driveBookings && typeof saved.driveBookings === 'object' ? saved.driveBookings : {},
      };
    } catch (error) {
      throw new Error('Your saved browser data could not be read. Clear this site’s storage and try again.');
    }
  }

  function write(data) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      throw new Error('Your browser could not save this change. Check available storage and try again.');
    }
  }

  function update(mutator) {
    const data = read();
    mutator(data);
    write(data);
    return data;
  }

  function hashPassword(password, salt) {
    if (!window.crypto?.subtle || !window.crypto?.getRandomValues) {
      return Promise.reject(new Error('Secure browser storage is unavailable. Open this site in a modern browser over HTTPS or localhost.'));
    }
    const saltBytes = salt
      ? Uint8Array.from(atob(salt), (character) => character.charCodeAt(0))
      : window.crypto.getRandomValues(new Uint8Array(16));
    const saltValue = btoa(String.fromCharCode(...saltBytes));
    const encoder = new TextEncoder();
    return window.crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
      .then((key) => window.crypto.subtle.deriveBits({
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 120000,
        hash: 'SHA-256',
      }, key, 256))
      .then((digest) => ({
        salt: saltValue,
        hash: Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join(''),
      }));
  }

  function showMessage(container, message, type = 'error') {
    let status = container.querySelector('[data-platform-message]');
    if (!status) {
      status = document.createElement('p');
      status.dataset.platformMessage = '';
      container.prepend(status);
    }
    status.setAttribute('role', type === 'error' ? 'alert' : 'status');
    status.className = `auth-message ${type}`;
    status.textContent = message;
  }

  function showToast(message, success = false) {
    document.querySelector('.form-toast-alert')?.remove();
    const toast = document.createElement('div');
    toast.className = `form-toast-alert ${success ? 'success' : 'error'} show`;
    toast.setAttribute('role', success ? 'status' : 'alert');
    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = success ? 'check_circle' : 'error';
    const text = document.createElement('span');
    text.textContent = message;
    toast.append(icon, text);
    document.body.append(toast);
    window.setTimeout(() => {
      toast.classList.remove('show');
      window.setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  window.PlatformStore = { read, write, update, hashPassword, showMessage, showToast };
})();
