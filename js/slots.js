/**
 * Interactive Appointment Slot Selector
 */
document.addEventListener('DOMContentLoaded', () => {
    const slotPills = document.querySelectorAll('.slot-pill');
    const slotInput = document.getElementById('selected-slot');

    slotPills.forEach(pill => {
        pill.addEventListener('click', () => {
            slotPills.forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            if (slotInput) {
                slotInput.value = pill.getAttribute('data-slot');
            }
        });
    });

    // Set default min date to today for appointment date input
    const dateInput = document.getElementById('fdate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
});
