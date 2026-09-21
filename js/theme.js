/**
 * Theme Switcher: Handles Dark / Light mode toggle and persistence
 */
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcons(savedTheme);

    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateToggleIcons(newTheme);
        });
    });
});

function updateToggleIcons(theme) {
    const icons = document.querySelectorAll('.theme-toggle-btn .material-symbols-outlined');
    icons.forEach(icon => {
        icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    });
}
