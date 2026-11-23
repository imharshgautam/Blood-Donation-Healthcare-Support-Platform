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
        const now = new Date();
        const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
            .map(value => String(value).padStart(2, '0'))
            .join('-');
        dateInput.min = today;
        dateInput.value = new URLSearchParams(window.location.search).get('date') || today;
    }

    const params = new URLSearchParams(window.location.search);
    const drive = params.get('drive');
    const locationInput = document.getElementById('flocation');
    if (drive && locationInput) locationInput.value = drive;
    if (drive && dateInput && params.has('date')) dateInput.readOnly = true;
});
