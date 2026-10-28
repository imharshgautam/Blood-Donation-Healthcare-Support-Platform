(() => {
  const form = document.querySelector('.auth-form');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  let submitting = false;

  function showMessage(message, type = 'error') {
    let status = form.querySelector('[role="alert"]');
    if (!status) {
      status = document.createElement('p');
      status.setAttribute('role', 'alert');
      status.className = 'auth-message';
      submitButton.before(status);
    }
    status.className = `auth-message ${type}`;
    status.textContent = message;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!form.reportValidity()) return;
    submitting = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Creating account...';

    try {
      const data = new FormData(form);
      const result = await window.AuthAPI.authenticatedRequest('/api/auth/signup', {
        email: data.get('email'),
        username: data.get('username'),
        password: data.get('password'),
        tandc: data.get('tandc') === 'on',
      });
      showMessage(result.message, 'success');
      window.setTimeout(() => window.location.assign('./login.html'), 700);
    } catch (error) {
      showMessage(error.message);
      const fieldError = error.errors?.[0]?.field;
      if (fieldError) form.elements[fieldError]?.focus();
    } finally {
      submitting = false;
      submitButton.disabled = false;
      submitButton.textContent = 'Create Account';
    }
  });
})();
