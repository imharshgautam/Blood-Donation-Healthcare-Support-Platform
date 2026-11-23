
/**
 * Recipient / Emergency Request Validation
 * Handles input validation and user feedback.
 */

// ==========================================
// RECIPIENT FORM TOAST NOTIFICATION
// ==========================================

function rShowFormToast(message, isSuccess = false) {

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
// CLEAR RECIPIENT FIELD ERRORS
// ==========================================

function rClearFieldErrors() {

    document.querySelectorAll('.input-error').forEach(element => {

        element.classList.remove('input-error');
        element.removeAttribute('aria-invalid');

    });
}


// ==========================================
// SHOW ERROR ON SPECIFIC FIELD
// ==========================================

function rSetFieldError(elementId) {

    const element = document.getElementById(elementId);

    if (!element) return;

    element.classList.add('input-error');
    element.setAttribute('aria-invalid', 'true');

    element.focus();
}


// ==========================================
// RECIPIENT FORM VALIDATION
// ==========================================

function rValidate() {

    rClearFieldErrors();

    // Get form fields
    const nameEl = document.getElementById('fname');
    const emailEl = document.getElementById('femail');
    const phoneEl = document.getElementById('fphone');
    const typeEl = document.getElementById('ftype');
    const detailsEl = document.getElementById('fdetails');

    // Read values safely
    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const bloodGroup = typeEl ? typeEl.value : '';
    const details = detailsEl ? detailsEl.value.trim() : '';

    // 1. Validate patient / attendant name
    if (!name || name.length < 3) {

        rSetFieldError('fname');

        rShowFormToast(
            'Please enter patient or attendant full name (at least 3 characters).'
        );

        return false;
    }

    // 2. Validate required blood group
    if (!bloodGroup) {

        rSetFieldError('ftype');

        rShowFormToast(
            'Please select the required blood group.'
        );

        return false;
    }

    // 3. Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {

        rSetFieldError('femail');

        rShowFormToast(
            'Please enter a valid contact email.'
        );

        return false;
    }

    // 4. Validate emergency phone number
    const phoneDigits = phone.replace(/[\s()-]/g, '');

    if (!/^\d{10}$/.test(phoneDigits)) {

        rSetFieldError('fphone');

        rShowFormToast(
            'Please enter a valid 10-digit emergency phone number.'
        );

        return false;
    }

    // 5. Validate hospital and location details
    if (!details || details.length < 10) {

        rSetFieldError('fdetails');

        rShowFormToast(
            'Please provide complete hospital name, ward, and location.'
        );

        return false;
    }

    // ======================================
    // VALIDATION SUCCESS
    // ======================================

    rShowFormToast(
        'All emergency request details are valid. Your form is ready to submit.',
        true
    );

    // Keep entered values for actual form submission.
    // Validation does not itself dispatch donor alerts.

    return true;
}
