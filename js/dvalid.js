/**
 * Donor Form Validation & User Feedback
 */
function showFormToast(message, isSuccess = false) {
    const existingToast = document.querySelector('.form-toast-alert');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `form-toast-alert ${isSuccess ? 'success' : 'error'}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <span class="material-symbols-outlined">${isSuccess ? 'check_circle' : 'error'}</span>
        <span>${message}</span>
    `;
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
    const age = ageEl ? parseInt(ageEl.value, 10) : 0;
    const weight = weightEl ? parseInt(weightEl.value, 10) : 0;
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const type = typeEl ? typeEl.value : '';

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
    if (!age || age < 18 || age > 65) {
        setFieldError('fage');
        showFormToast('Eligible donors must be between 18 and 65 years old.');
        return false;
    }
    if (!weight || weight < 45) {
        setFieldError('fweight');
        showFormToast('Donors must weigh at least 45-50 kg for safe blood donation.');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        setFieldError('femail');
        showFormToast('Please provide a valid email address.');
        return false;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone || phoneDigits.length < 10) {
        setFieldError('fphone');
        showFormToast('Please enter a valid 10-digit phone number.');
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