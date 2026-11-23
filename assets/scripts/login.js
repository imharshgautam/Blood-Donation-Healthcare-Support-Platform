(() => {
  const form = document.querySelector('.auth-form');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Signing in...';
    try {
      const data = new FormData(form);
      const identifier = String(data.get('username')).trim().toLowerCase();
      const account = window.PlatformStore.read().users.find((user) =>
        user.username.toLowerCase() === identifier || user.email.toLowerCase() === identifier);

      if (!account) throw new Error('No account was found with that username or email.');
      const candidate = await window.PlatformStore.hashPassword(String(data.get('password')), account.passwordSalt);
      if (candidate.hash !== account.passwordHash) throw new Error('The password you entered is incorrect.');

      const session = { username: account.username, email: account.email };
      const storage = document.querySelector('#remember').checked ? localStorage : sessionStorage;
      localStorage.removeItem('blood-donation-session');
      sessionStorage.removeItem('blood-donation-session');
      storage.setItem('blood-donation-session', JSON.stringify(session));
      window.PlatformStore.showMessage(form, 'Signed in successfully. Redirecting...', 'success');
      window.location.assign('./index.html');
    } catch (error) {
      window.PlatformStore.showMessage(form, error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Sign In';
    }
  });

  const forgotLink = form.querySelector('.forgot-pass');
  forgotLink?.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = window.prompt('Enter the email address on your local demo account:');
    if (!email) return;

    try {
      const data = window.PlatformStore.read();
      const account = data.users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
      if (!account) throw new Error('No local account was found for that email address.');

      const password = window.prompt('Choose a new password (at least 8 characters, including a letter and a number):');
      if (password === null) return;
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        throw new Error('Use at least 8 characters, including a letter and a number.');
      }

      const credential = await window.PlatformStore.hashPassword(password);
      window.PlatformStore.update((current) => {
        const existing = current.users.find((user) => user.email.toLowerCase() === account.email.toLowerCase());
        if (!existing) throw new Error('The local account is no longer available.');
        existing.passwordSalt = credential.salt;
        existing.passwordHash = credential.hash;
      });
      window.PlatformStore.showMessage(form, 'Password updated for this browser. No email was sent.', 'success');
    } catch (error) {
      window.PlatformStore.showMessage(form, error.message);
    }
  });
})();
