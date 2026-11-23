
/**
 * Interactive Appointment Slot Selector
 * Handles appointment time selection and date restrictions.
 */

document.addEventListener('DOMContentLoaded', () => {

    const slotPills = document.querySelectorAll('.slot-pill');
    const slotInput = document.getElementById('selected-slot');
    const dateInput = document.getElementById('fdate');

    // ======================================
    // APPOINTMENT SLOT SELECTOR
    // ======================================

    function selectSlot(selectedPill) {

        slotPills.forEach(pill => {

            const isSelected = pill === selectedPill;

            pill.classList.toggle('selected', isSelected);

            pill.setAttribute(
                'aria-pressed',
                String(isSelected)
            );

        });

        if (slotInput) {
            slotInput.value = selectedPill.getAttribute('data-slot') || '';
        }
    }

    // Initialize selected slot
    const initiallySelected = document.querySelector(
        '.slot-pill.selected[data-slot]'
    );

    slotPills.forEach(pill => {

        const isSelected = pill === initiallySelected;

        pill.setAttribute('aria-pressed', String(isSelected));

        pill.addEventListener('click', () => {
            selectSlot(pill);
        });

    });

    // Initialize hidden input
    if (slotInput) {
        slotInput.value = initiallySelected
            ? initiallySelected.getAttribute('data-slot') || ''
            : '';
    }


    // ======================================
    // APPOINTMENT DATE RESTRICTION
    // ======================================

    if (dateInput) {

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        const today = `${year}-${month}-${day}`;

        // Prevent selecting past dates
        dateInput.min = today;

        // Set today's date only if no date is already selected
        if (!dateInput.value) {
            dateInput.value = today;
        }

        // Validate date whenever user changes it
        dateInput.addEventListener('change', () => {

            if (dateInput.value && dateInput.value < today) {

                dateInput.value = today;

                if (typeof showFormToast === 'function') {
                    showFormToast(
                        'Past appointment dates are not allowed.'
                    );
                }
            }

        });
    }

});
