(() => {
  const form = document.querySelector('.auth-form');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const email = String(data.get('email')).trim().toLowerCase();
    const username = String(data.get('username')).trim();
    const password = String(data.get('password'));
    const confirmPassword = String(data.get('confirmPassword'));

    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) {
      window.PlatformStore.showMessage(form, 'Username must be 3–30 characters and use only letters, numbers, dots, underscores, or hyphens.');
      form.elements.username.focus();
      return;
    }
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      window.PlatformStore.showMessage(form, 'Use at least 8 characters, including a letter and a number.');
      form.elements.password.focus();
      return;
    }
    if (password !== confirmPassword) {
      window.PlatformStore.showMessage(form, 'The passwords do not match.');
      form.elements.confirmPassword.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Creating account...';
    try {
      const accounts = window.PlatformStore.read().users;
      if (accounts.some((user) => user.email.toLowerCase() === email)) {
        throw new Error('An account already exists for that email address.');
      }
      if (accounts.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('That username is already in use.');
      }

      const credential = await window.PlatformStore.hashPassword(password);
      window.PlatformStore.update((current) => {
        if (current.users.some((user) => user.email.toLowerCase() === email)) {
          throw new Error('An account already exists for that email address.');
        }
        if (current.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
          throw new Error('That username is already in use.');
        }
        current.users.push({
          id: window.crypto.randomUUID(),
          email,
          username,
          passwordSalt: credential.salt,
          passwordHash: credential.hash,
          createdAt: new Date().toISOString(),
        });
      });
      window.PlatformStore.showMessage(form, 'Account created in this browser. You can now sign in.', 'success');
      form.reset();
    } catch (error) {
      window.PlatformStore.showMessage(form, error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Create Account';
    }
  });
})();
