/**
 * Recipient / Emergency Request Validation & User Feedback
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

function rValidate() {
    clearFieldErrors();

    const nameEl = document.getElementById('fname');
    const emailEl = document.getElementById('femail');
    const phoneEl = document.getElementById('fphone');
    const typeEl = document.getElementById('ftype');
    const detailsEl = document.getElementById('fdetails');

    const names = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const type = typeEl ? typeEl.value : '';
    const details = detailsEl ? detailsEl.value.trim() : '';

    if (!names || names.length < 3) {
        setFieldError('fname');
        showFormToast('Please enter patient or attendant full name.');
        return false;
    }
    if (!type) {
        setFieldError('ftype');
        showFormToast('Please select the required blood group.');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        setFieldError('femail');
        showFormToast('Please enter a valid contact email.');
        return false;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone || phoneDigits.length < 10) {
        setFieldError('fphone');
        showFormToast('Please enter a valid 10-digit emergency phone number.');
        return false;
    }
    if (!details || details.length < 10) {
        setFieldError('fdetails');
        showFormToast('Please provide complete hospital name, ward, and location.');
        return false;
    }

    showFormToast('Emergency request submitted! Our rapid response coordinator has dispatched alerts to nearby verified donors.', true);
    
    // Clear fields
    if (nameEl) nameEl.value = '';
    if (emailEl) emailEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (typeEl) typeEl.selectedIndex = 0;
    if (detailsEl) detailsEl.value = '';

    return true;
}