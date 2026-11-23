(() => {
  const form = document.querySelector('#request-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.querySelectorAll('.input-error').forEach((field) => field.classList.remove('input-error'));

    const name = document.querySelector('#fname');
    const blood = document.querySelector('#ftype');
    const email = document.querySelector('#femail');
    const phone = document.querySelector('#fphone');
    const details = document.querySelector('#fdetails');
    const proof = document.querySelector('#fproof');
    const invalid = (field, message) => {
      field.classList.add('input-error');
      field.focus();
      window.PlatformStore.showToast(message);
      return false;
    };

    if (name.value.trim().length < 3) return invalid(name, 'Please enter the patient or attendant full name.');
    if (!blood.value) return invalid(blood, 'Please select the required blood group.');
    if (!email.validity.valid || !email.value.trim()) return invalid(email, 'Please enter a valid contact email.');
    const phoneDigits = phone.value.replace(/\D/g, '');
    if (!/^[\d+().\s-]+$/.test(phone.value.trim()) || phoneDigits.length < 10 || phoneDigits.length > 15) {
      return invalid(phone, 'Please enter a valid emergency phone number with 10 to 15 digits.');
    }
    if (details.value.trim().length < 10) return invalid(details, 'Please provide the hospital name, ward, and complete location.');
    if (!proof.files?.length) return invalid(proof, 'Please choose a hospital requisition slip or ID proof. It will not be uploaded.');
    const proofFile = proof.files[0];
    if (!(proofFile.type === 'application/pdf' || proofFile.type.startsWith('image/') || /\.(pdf|jpe?g|png|gif|webp)$/i.test(proofFile.name))) {
      return invalid(proof, 'Proof must be a PDF or image file.');
    }
    if (proofFile.size > 10 * 1024 * 1024) return invalid(proof, 'Proof must be 10 MB or smaller.');

    try {
      const now = new Date().toISOString();
      const request = {
        id: window.crypto.randomUUID(),
        patient: name.value.trim(),
        facility: details.value.trim(),
        blood: blood.value,
        units: 1,
        needed: 'As soon as possible',
        email: email.value.trim().toLowerCase(),
        phone: phone.value.trim(),
        gender: form.querySelector('input[name="gender"]:checked')?.value || '',
        proofFileName: proofFile.name,
        status: 'Critical',
        createdAt: now,
      };
      window.PlatformStore.update((data) => data.requests.push(request));
      form.reset();
      window.PlatformStore.showToast('Emergency request saved on this device. This demo does not contact hospitals or donors.', true);
    } catch (error) {
      window.PlatformStore.showToast(error.message);
    }
  });
})();
