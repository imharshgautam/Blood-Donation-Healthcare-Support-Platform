(() => {
  async function updateNavigation() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;

    try {
      const { user } = await window.AuthAPI.request('/api/auth/me');
      const loginLink = navRight.querySelector('a[href="./login.html"]');
      const signupLink = navRight.querySelector('a[href="./signup.html"]');
      if (loginLink) loginLink.remove();
      if (signupLink) signupLink.remove();

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'login-btn primary-btn';
      button.textContent = 'Log out';
      button.addEventListener('click', async () => {
        button.disabled = true;
        try {
          await window.AuthAPI.authenticatedRequest('/api/auth/logout');
          window.location.reload();
        } catch (error) {
          button.disabled = false;
          window.alert(error.message);
        }
      });
      navRight.append(button);
      navRight.setAttribute('aria-label', `Signed in as ${user.username}`);
    } catch (error) {
      if (error.status !== 401) console.error(error);
    }
  }

  updateNavigation();
})();
