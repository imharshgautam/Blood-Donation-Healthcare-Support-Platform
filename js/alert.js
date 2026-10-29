
/**
 * Emergency Blood Alert Banner Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    const alertBanner = document.querySelector('.emergency-alert-banner');
    const dismissBtn = document.querySelector('.alert-dismiss-btn');

    // Stop if the banner or dismiss button does not exist.
    if (!alertBanner || !dismissBtn) {
        return;
    }

    const storageKey = 'emergencyAlertDismissed';

    // Keep the banner hidden if it was already dismissed.
    if (sessionStorage.getItem(storageKey) === 'true') {
        alertBanner.style.display = 'none';
        return;
    }

    // Handle the dismiss button click.
    dismissBtn.addEventListener('click', () => {
        alertBanner.style.opacity = '0';
        alertBanner.style.transform = 'translateY(-100%)';

        // Remember the dismissal for the current browser session.
        sessionStorage.setItem(storageKey, 'true');

        // Hide the banner after the transition.
        setTimeout(() => {
            alertBanner.style.display = 'none';
        }, 300);
    });
});
