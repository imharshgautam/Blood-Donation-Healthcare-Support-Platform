
/**
 * Theme Switcher
 * Handles Dark / Light mode toggle and persistence.
 */

document.addEventListener('DOMContentLoaded', () => {

    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

    // Read saved theme safely
    function getSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('theme');

            return savedTheme === 'dark' || savedTheme === 'light'
                ? savedTheme
                : 'light';

        } catch (error) {
            console.warn('Unable to access saved theme:', error);
            return 'light';
        }
    }

    // Save selected theme safely
    function saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.warn('Unable to save theme:', error);
        }
    }

    // Apply theme to website
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        updateToggleIcons(theme);
    }

    // Update all theme toggle buttons
    function updateToggleIcons(theme) {

        themeToggleBtns.forEach(btn => {

            const icon = btn.querySelector('.material-symbols-outlined');

            if (icon) {
                icon.textContent = theme === 'dark'
                    ? 'light_mode'
                    : 'dark_mode';
            }

            const nextTheme = theme === 'dark' ? 'light' : 'dark';

            btn.setAttribute(
                'aria-label',
                `Switch to ${nextTheme} mode`
            );

            btn.setAttribute(
                'title',
                `Switch to ${nextTheme} mode`
            );

            btn.setAttribute(
                'aria-pressed',
                String(theme === 'dark')
            );
        });
    }

    // Load previously saved theme
    const savedTheme = getSavedTheme();

    applyTheme(savedTheme);

    // Add click event to every theme toggle button
    themeToggleBtns.forEach(btn => {

        btn.addEventListener('click', () => {

            const currentTheme =
                document.documentElement.getAttribute('data-theme') || 'light';

            const newTheme =
                currentTheme === 'dark' ? 'light' : 'dark';

            applyTheme(newTheme);

            saveTheme(newTheme);
        });

    });

});
