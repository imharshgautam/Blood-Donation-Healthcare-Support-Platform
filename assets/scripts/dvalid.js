(() => {
  const form = document.querySelector('#donor-form');
  if (!form) return;

  const clearErrors = () => form.querySelectorAll('.input-error').forEach((field) => field.classList.remove('input-error'));
  const invalid = (field, message) => {
    field.classList.add('input-error');
    field.focus();
    window.PlatformStore.showToast(message);
    return false;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const name = document.querySelector('#fname');
    const blood = document.querySelector('#ftype');
    const age = document.querySelector('#fage');
    const weight = document.querySelector('#fweight');
    const email = document.querySelector('#femail');
    const phone = document.querySelector('#fphone');
    const date = document.querySelector('#fdate');
    const location = document.querySelector('#flocation');
    const proof = document.querySelector('#fproof');

    if (name.value.trim().length < 3) return invalid(name, 'Please enter your full name (at least 3 characters).');
    if (!blood.value) return invalid(blood, 'Please select your blood group.');
    if (!Number.isInteger(Number(age.value)) || Number(age.value) < 18 || Number(age.value) > 65) {
      return invalid(age, 'Eligible donors must be between 18 and 65 years old.');
    }
    if (!Number.isFinite(Number(weight.value)) || Number(weight.value) < 45 || Number(weight.value) > 180) {
      return invalid(weight, 'Please enter a weight between 45 and 180 kg.');
    }
    if (!email.validity.valid || !email.value.trim()) return invalid(email, 'Please provide a valid email address.');
    const phoneDigits = phone.value.replace(/\D/g, '');
    if (!/^[\d+().\s-]+$/.test(phone.value.trim()) || phoneDigits.length < 10 || phoneDigits.length > 15) {
      return invalid(phone, 'Please enter a valid phone number with 10 to 15 digits.');
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayValue = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
      .map((value) => String(value).padStart(2, '0')).join('-');
    if (!date.value || new Date(`${date.value}T00:00:00`) < today) return invalid(date, 'Please choose today or a future donation date.');
    const selectedDriveDate = new URLSearchParams(window.location.search).get('date');
    if (selectedDriveDate && date.value !== selectedDriveDate) return invalid(date, 'The selected drive is only available on the displayed date.');
    if (location.value.trim().length < 3) return invalid(location, 'Please enter a donation center or drive location.');
    if (!proof.files?.length) return invalid(proof, 'Please choose an ID proof file. It will remain on this device and will not be uploaded.');
    const proofFile = proof.files[0];
    if (!(proofFile.type === 'application/pdf' || proofFile.type.startsWith('image/') || /\.(pdf|jpe?g|png|gif|webp)$/i.test(proofFile.name))) {
      return invalid(proof, 'ID proof must be a PDF or image file.');
    }
    if (proofFile.size > 10 * 1024 * 1024) return invalid(proof, 'ID proof must be 10 MB or smaller.');

    const donorEmail = email.value.trim().toLowerCase();
    const driveName = new URLSearchParams(window.location.search).get('drive');
    try {
      const saved = window.PlatformStore.read();
      if (saved.donors.some((donor) => donor.email.toLowerCase() === donorEmail)) {
        return invalid(email, 'A donor registration for this email already exists on this device.');
      }
      if (driveName && (!Number.isFinite(Number(saved.driveBookings[driveName])) || Number(saved.driveBookings[driveName]) < 1)) {
        return invalid(location, 'This drive is fully booked. Choose another donation center.');
      }

      const id = window.crypto.randomUUID();
      const donor = {
        id,
        name: name.value.trim(),
        email: donorEmail,
        blood: blood.value,
        location: location.value.trim(),
        age: Number(age.value),
        weight: Number(weight.value),
        gender: form.querySelector('input[name="gender"]:checked')?.value || '',
        preferredDate: date.value,
        slot: document.querySelector('#selected-slot').value,
        medicalDetails: document.querySelector('#fdetails').value.trim(),
        proofFileName: proofFile.name,
        drive: driveName || '',
        status: 'Available',
        createdAt: new Date().toISOString(),
      };
      window.PlatformStore.update((data) => {
        data.donors.push(donor);
        if (driveName) data.driveBookings[driveName] = Math.max(0, Number(data.driveBookings[driveName] || 0) - 1);
        data.appointments.push({
          id: window.crypto.randomUUID(),
          donor: donor.name,
          email: donor.email,
          blood: donor.blood,
          location: donor.location,
          date: `${donor.preferredDate} · ${donor.slot}`,
          status: 'Scheduled',
          createdAt: donor.createdAt,
        });
      });

      const certificateName = document.querySelector('.cert-donor-name');
      if (certificateName) certificateName.textContent = donor.name;
      form.reset();
      document.querySelector('#selected-slot').value = 'Morning (09:00 AM - 12:00 PM)';
      document.querySelectorAll('.slot-pill').forEach((pill, index) => pill.classList.toggle('selected', index === 0));
      document.querySelector('#flocation').value = driveName || '';
      document.querySelector('#fdate').value = selectedDriveDate || todayValue;
      window.PlatformStore.showToast('Donor registration and appointment saved on this device.', true);
    } catch (error) {
      window.PlatformStore.showToast(error.message);
    }
  });
})();
