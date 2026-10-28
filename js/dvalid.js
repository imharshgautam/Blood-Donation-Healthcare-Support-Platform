/**
 * Donor Form Validation & User Feedback
 */
function showFormToast(message, isSuccess = false) {
    const existingToast = document.querySelector('.form-toast-alert');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `form-toast-alert ${isSuccess ? 'success' : 'error'}`;
    toast.setAttribute('role', 'alert');
    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = isSuccess ? 'check_circle' : 'error';
    const text = document.createElement('span');
    text.textContent = message;
    toast.append(icon, text);
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}

function clearFieldErrors() {
    document.querySelectorAll('.c-input.input-error').forEach(el => {
        el.classList.remove('input-error');
    });
}

function setFieldError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.classList.add('input-error');
        el.focus();
    }
}

function dValidate() {
    clearFieldErrors();

    const nameEl = document.getElementById('fname');
    const ageEl = document.getElementById('fage');
    const weightEl = document.getElementById('fweight');
    const emailEl = document.getElementById('femail');
    const phoneEl = document.getElementById('fphone');
    const typeEl = document.getElementById('ftype');
    const detailsEl = document.getElementById('fdetails');

    const names = nameEl ? nameEl.value.trim() : '';
    const age = ageEl ? Number(ageEl.value) : 0;
    const weight = weightEl ? Number(weightEl.value) : 0;
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const type = typeEl ? typeEl.value : '';
    const dateEl = document.getElementById('fdate');
    const appointmentDate = dateEl ? dateEl.value : '';
    const slotEl = document.getElementById('selected-slot');
    const selectedSlot = slotEl ? slotEl.value : '';
    const selectedSlotButton = document.querySelector('.slot-pill.selected[data-slot]');

    if (!names || names.length < 3) {
        setFieldError('fname');
        showFormToast('Please enter your full legal name (at least 3 characters).');
        return false;
    }
    if (!type) {
        setFieldError('ftype');
        showFormToast('Please select your blood group.');
        return false;
    }
    if (!Number.isInteger(age) || age < 18 || age > 65) {
        setFieldError('fage');
        showFormToast('Eligible donors must be between 18 and 65 years old.');
        return false;
    }
    if (!Number.isFinite(weight) || weight < 45 || weight > 180) {
        setFieldError('fweight');
        showFormToast('Donors must weigh between 45 and 180 kg.');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        setFieldError('femail');
        showFormToast('Please provide a valid email address.');
        return false;
    }
    const phoneDigits = phone.replace(/[\s()-]/g, '');
    if (!/^\d{10}$/.test(phoneDigits)) {
        setFieldError('fphone');
        showFormToast('Please enter a valid 10-digit phone number.');
        return false;
    }
    const today = new Date();
    const minimumDate = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
        .map(value => String(value).padStart(2, '0'))
        .join('-');
    if (!appointmentDate || appointmentDate < minimumDate) {
        setFieldError('fdate');
        showFormToast('Please select an appointment date that is today or later.');
        return false;
    }
    if (!selectedSlot) {
        const firstSlotButton = document.querySelector('.slot-pill');
        if (firstSlotButton) firstSlotButton.focus();
        showFormToast('Please select an appointment time slot.');
        return false;
    }
    if (!selectedSlotButton || selectedSlotButton.getAttribute('data-slot') !== selectedSlot) {
        if (selectedSlotButton) selectedSlotButton.focus();
        showFormToast('Please select an appointment time slot.');
        return false;
    }

    showFormToast('Thank you! Your donation appointment has been successfully scheduled. Our coordinator will contact you shortly.', true);
    
    // Clear fields
    if (nameEl) nameEl.value = '';
    if (ageEl) ageEl.value = '';
    if (weightEl) weightEl.value = '';
    if (emailEl) emailEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (typeEl) typeEl.selectedIndex = 0;
    if (detailsEl) detailsEl.value = '';

    return true;
}