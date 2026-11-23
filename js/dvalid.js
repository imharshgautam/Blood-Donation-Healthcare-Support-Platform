
/**
 * Donor Form Validation & User Feedback
 */

// ==========================================
// FORM TOAST NOTIFICATION
// ==========================================

function showFormToast(message, isSuccess = false) {

    const existingToast = document.querySelector('.form-toast-alert');

    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');

    toast.className = `form-toast-alert ${isSuccess ? 'success' : 'error'}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = isSuccess ? 'check_circle' : 'error';

    const text = document.createElement('span');
    text.textContent = message;

    toast.append(icon, text);
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 4500);
}


// ==========================================
// CLEAR FIELD ERRORS
// ==========================================

function clearFieldErrors() {

    document.querySelectorAll('.input-error').forEach(element => {

        element.classList.remove('input-error');
        element.removeAttribute('aria-invalid');

    });
}


// ==========================================
// SHOW ERROR ON SPECIFIC FIELD
// ==========================================

function setFieldError(elementId) {

    const element = document.getElementById(elementId);

    if (!element) return;

    element.classList.add('input-error');
    element.setAttribute('aria-invalid', 'true');

    element.focus();
}


// ==========================================
// DONOR FORM VALIDATION
// ==========================================

function dValidate() {

    clearFieldErrors();

    // Get form fields
    const nameEl = document.getElementById('fname');
    const ageEl = document.getElementById('fage');
    const weightEl = document.getElementById('fweight');
    const emailEl = document.getElementById('femail');
    const phoneEl = document.getElementById('fphone');
    const typeEl = document.getElementById('ftype');
    const dateEl = document.getElementById('fdate');
    const detailsEl = document.getElementById('fdetails');

    // Read values safely
    const name = nameEl ? nameEl.value.trim() : '';
    const age = ageEl ? Number(ageEl.value) : NaN;
    const weight = weightEl ? Number(weightEl.value) : NaN;
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const bloodGroup = typeEl ? typeEl.value : '';
    const appointmentDate = dateEl ? dateEl.value : '';

    const slotEl = document.getElementById('selected-slot');
    const selectedSlot = slotEl ? slotEl.value.trim() : '';

    const selectedSlotButton = document.querySelector(
        '.slot-pill.selected[data-slot]'
    );

    // 1. Validate full name
    if (!name || name.length < 3) {

        setFieldError('fname');

        showFormToast(
            'Please enter your full legal name (at least 3 characters).'
        );

        return false;
    }

    // 2. Validate blood group
    if (!bloodGroup) {

        setFieldError('ftype');

        showFormToast('Please select your blood group.');

        return false;
    }

    // 3. Validate age
    if (!Number.isInteger(age) || age < 18 || age > 65) {

        setFieldError('fage');

        showFormToast(
            'Eligible donors must be between 18 and 65 years old.'
        );

        return false;
    }

    // 4. Validate weight
    if (!Number.isFinite(weight) || weight < 45 || weight > 180) {

        setFieldError('fweight');

        showFormToast(
            'Donors must weigh between 45 and 180 kg.'
        );

        return false;
    }

    // 5. Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {

        setFieldError('femail');

        showFormToast('Please provide a valid email address.');

        return false;
    }

    // 6. Validate phone number
    const phoneDigits = phone.replace(/[\s()-]/g, '');

    if (!/^\d{10}$/.test(phoneDigits)) {

        setFieldError('fphone');

        showFormToast(
            'Please enter a valid 10-digit phone number.'
        );

        return false;
    }

    // 7. Validate appointment date
    const today = new Date();

    const minimumDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
    ].join('-');

    if (!appointmentDate || appointmentDate < minimumDate) {

        setFieldError('fdate');

        showFormToast(
            'Please select an appointment date that is today or later.'
        );

        return false;
    }

    // 8. Validate appointment time slot
    if (!selectedSlot || !selectedSlotButton) {

        const firstSlotButton = document.querySelector('.slot-pill');

        if (firstSlotButton) {
            firstSlotButton.focus();
        }

        showFormToast(
            'Please select an appointment time slot.'
        );

        return false;
    }

    // 9. Verify selected slot consistency
    if (
        selectedSlotButton.getAttribute('data-slot') !== selectedSlot
    ) {

        selectedSlotButton.focus();

        showFormToast(
            'Please select an appointment time slot again.'
        );

        return false;
    }

    // ======================================
    // VALIDATION SUCCESS
    // ======================================

    showFormToast(
        'All donor details are valid. Your form is ready to submit.',
        true
    );

    // Do not clear fields here.
    // The browser needs their values for form submission.

    return true;
}
