/**
 * Modal Handling Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const openBtns = document.querySelectorAll('[data-modal-target]');
    const closeBtns = document.querySelectorAll('[data-modal-close]');
    const overlays = document.querySelectorAll('.modal-overlay');
    const updateScrollLock = () => {
        document.body.style.overflow = document.querySelector('.modal-overlay.active') ? 'hidden' : '';
    };

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-modal-target');
            const targetModal = document.querySelector(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                updateScrollLock();
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                updateScrollLock();
            }
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                updateScrollLock();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            overlays.forEach(overlay => {
                overlay.classList.remove('active');
            });
            updateScrollLock();
        }
    });
});
