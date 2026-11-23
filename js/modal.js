

/**
 * Modal Handling Logic
 * Opens, closes and manages accessible modal dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {

    const openBtns = document.querySelectorAll('[data-modal-target]');
    const closeBtns = document.querySelectorAll('[data-modal-close]');
    const overlays = document.querySelectorAll('.modal-overlay');

    let activeModal = null;
    let lastFocusedElement = null;

    // Find focusable elements inside a modal
    function getFocusableElements(modal) {
        return modal.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), ' +
            'select:not([disabled]), textarea:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"])'
        );
    }

    // Update page scroll lock
    function updateScrollLock() {
        const hasActiveModal = document.querySelector('.modal-overlay.active');

        document.body.style.overflow = hasActiveModal ? 'hidden' : '';
    }

    // Open modal
    function openModal(modal, trigger) {

        if (!modal) return;

        // Close previously active modal
        if (activeModal && activeModal !== modal) {
            closeModal(activeModal, false);
        }

        lastFocusedElement = trigger || document.activeElement;
        activeModal = modal;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
        }

        updateScrollLock();

        // Move keyboard focus inside modal
        const focusableElements = getFocusableElements(modal);

        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        } else {
            modal.setAttribute('tabindex', '-1');
            modal.focus();
        }
    }

    // Close modal
    function closeModal(modal, restoreFocus = true) {

        if (!modal) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        // Reset expanded state on its trigger
        openBtns.forEach(btn => {
            try {
                if (document.querySelector(btn.getAttribute('data-modal-target')) === modal) {
                    btn.setAttribute('aria-expanded', 'false');
                }
            } catch (error) {
                // Ignore invalid selectors
            }
        });

        if (activeModal === modal) {
            activeModal = null;
        }

        updateScrollLock();

        // Restore focus to the element that opened the modal
        if (restoreFocus && lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    // Open buttons
    openBtns.forEach(btn => {

        btn.setAttribute('aria-expanded', 'false');

        btn.addEventListener('click', event => {

            event.preventDefault();

            const targetId = btn.getAttribute('data-modal-target');

            if (!targetId) return;

            try {
                const targetModal = document.querySelector(targetId);

                if (targetModal) {
                    openModal(targetModal, btn);
                }

            } catch (error) {
                console.warn('Invalid modal target:', targetId);
            }
        });
    });

    // Close buttons
    closeBtns.forEach(btn => {

        btn.addEventListener('click', () => {

            const modal = btn.closest('.modal-overlay');

            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal when clicking outside its content
    overlays.forEach(overlay => {

        overlay.setAttribute('aria-hidden', 'true');

        overlay.addEventListener('click', event => {

            if (event.target === overlay && overlay.classList.contains('active')) {
                closeModal(overlay);
            }
        });
    });

    // Keyboard controls: Escape and Tab focus trap
    document.addEventListener('keydown', event => {

        const modal = document.querySelector('.modal-overlay.active');

        if (!modal) return;

        // Close modal with Escape
        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal(modal);
            return;
        }

        // Keep keyboard focus inside modal
        if (event.key === 'Tab') {

            const focusableElements = getFocusableElements(modal);

            if (focusableElements.length === 0) {
                event.preventDefault();
                modal.focus();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();

            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });

});
