(() => {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  let user;
  try {
    const serialized = localStorage.getItem('blood-donation-session') || sessionStorage.getItem('blood-donation-session');
    user = serialized ? JSON.parse(serialized) : null;
  } catch (error) {
    window.PlatformStore?.showToast('Your saved sign-in could not be read. Please sign in again.');
    localStorage.removeItem('blood-donation-session');
    sessionStorage.removeItem('blood-donation-session');
    return;
  }
  if (!user?.username) return;

  navRight.querySelector('a[href="./login.html"]')?.parentElement.remove();
  navRight.querySelector('a[href="./signup.html"]')?.parentElement.remove();
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'login-btn primary-btn';
  button.textContent = 'Log out';
  button.setAttribute('aria-label', `Log out ${user.username}`);
  button.addEventListener('click', () => {
    localStorage.removeItem('blood-donation-session');
    sessionStorage.removeItem('blood-donation-session');
    window.location.reload();
  });
  navRight.append(button);
  navRight.setAttribute('aria-label', `Signed in as ${user.username}`);
})();
