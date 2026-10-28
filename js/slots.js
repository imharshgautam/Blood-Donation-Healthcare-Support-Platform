/**
 * Interactive Appointment Slot Selector
 */
document.addEventListener('DOMContentLoaded', () => {
    const slotPills = document.querySelectorAll('.slot-pill');
    const slotInput = document.getElementById('selected-slot');

    slotPills.forEach(pill => {
        pill.setAttribute('aria-pressed', String(pill.classList.contains('selected')));
    });

    slotPills.forEach(pill => {
        pill.addEventListener('click', () => {
            slotPills.forEach(p => {
                p.classList.remove('selected');
                p.setAttribute('aria-pressed', 'false');
            });
            pill.classList.add('selected');
            pill.setAttribute('aria-pressed', 'true');
            if (slotInput) {
                slotInput.value = pill.getAttribute('data-slot');
            }
        });
    });

    // Set default min date to today for appointment date input
    const dateInput = document.getElementById('fdate');
    if (dateInput) {
        const now = new Date();
        const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
            .map(value => String(value).padStart(2, '0'))
            .join('-');
        dateInput.min = today;
        dateInput.value = today;
    }
});
