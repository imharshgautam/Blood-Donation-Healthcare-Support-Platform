/**
 * Emergency Blood Alert Banner Controller
 */
document.addEventListener('DOMContentLoaded', () => {
    const alertBanner = document.querySelector('.emergency-alert-banner');
    const dismissBtn = document.querySelector('.alert-dismiss-btn');

    if (!alertBanner || !dismissBtn) return;

    const isDismissed = sessionStorage.getItem('emergencyAlertDismissed');
    if (isDismissed) {
        alertBanner.style.display = 'none';
    }

    dismissBtn.addEventListener('click', () => {
        alertBanner.style.opacity = '0';
        alertBanner.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            alertBanner.style.display = 'none';
        }, 300);
        sessionStorage.setItem('emergencyAlertDismissed', 'true');
    });
});
