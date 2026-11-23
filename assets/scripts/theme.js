/**
 * Theme Switcher: Handles Dark / Light mode toggle and persistence
 */
document.addEventListener('DOMContentLoaded', () => {
    function getSavedTheme() {
        try {
            const saved = localStorage.getItem('theme');
            return saved === 'dark' || saved === 'light' ? saved : 'light';
        } catch (error) {
            return 'light';
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            // Ignore storage errors in restricted browsing modes
        }
    }

    const savedTheme = getSavedTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcons(savedTheme);

    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            saveTheme(newTheme);
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
