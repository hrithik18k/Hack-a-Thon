const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const VALID_ROLES = new Set(["Doctor", "Patient"]);
const VALID_GENDERS = new Set(["male", "female", "other", ""]);
const VALID_BLOOD_GROUPS = new Set(["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);

function validationResult(isValid, message, data = null) {
  return { isValid, message, data };
}

function asTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value) {
  return asTrimmedString(value).replace(/\D/g, "");
}

function ensurePassword(value, label) {
  if (typeof value !== "string" || value.length < 8) {
    return `${label} must be at least 8 characters long`;
  }
  return "";
}

function sanitizeEmergencyContact(contact = {}) {
  return {
    name: asTrimmedString(contact.name),
    relation: asTrimmedString(contact.relation),
    phone1: normalizePhone(contact.phone1).slice(0, 10),
    phone2: normalizePhone(contact.phone2).slice(0, 10),
  };
}

function sanitizeUserFields(body = {}) {
  return {
    firstname: asTrimmedString(body.firstname),
    lastname: asTrimmedString(body.lastname),
    email: asTrimmedString(body.email).toLowerCase(),
    password: typeof body.password === "string" ? body.password : "",
    phone: normalizePhone(body.phone).slice(0, 10),
    city: asTrimmedString(body.city),
    role: asTrimmedString(body.role),
    dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
    gender: asTrimmedString(body.gender).toLowerCase(),
    bloodGroup: asTrimmedString(body.bloodGroup).toUpperCase(),
    pic: asTrimmedString(body.pic),
    permanentAddress: asTrimmedString(body.permanentAddress),
    temporaryAddress: asTrimmedString(body.temporaryAddress),
    emergencyContact: sanitizeEmergencyContact(body.emergencyContact),
  };
}

function validateCoreUserFields(data) {
  if (data.firstname.length < 2) return "First name must be at least 2 characters long";
  if (data.lastname.length < 2) return "Last name must be at least 2 characters long";
  if (!EMAIL_REGEX.test(data.email)) return "Enter a valid email address";
  if (!PHONE_REGEX.test(data.phone)) return "Phone number must be 10 digits";
  if (!data.city) return "City is required";
  if (!VALID_ROLES.has(data.role)) return "Invalid role selected";
  if (!VALID_GENDERS.has(data.gender)) return "Invalid gender value";
  if (!VALID_BLOOD_GROUPS.has(data.bloodGroup)) return "Invalid blood group value";
  return "";
}

function sanitizeDoctorFields(body = {}) {
  return {
    specialization: asTrimmedString(body.specialization),
    experience: asTrimmedString(body.experience),
    fees: asTrimmedString(body.fees),
    qualifications: asTrimmedString(body.qualifications),
    hospitalName: asTrimmedString(body.hospitalName),
    certificate: asTrimmedString(body.certificate),
  };
}

function validateDoctorFields(doctorData) {
  if (!doctorData.specialization) return "Specialization is required for doctor registration";
  if (!doctorData.experience) return "Experience is required for doctor registration";
  if (!doctorData.fees) return "Consultation fee is required for doctor registration";
  if (!doctorData.qualifications) return "Qualifications are required for doctor registration";
  if (!doctorData.hospitalName) return "Hospital name is required for doctor registration";
  return "";
}

function validateDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function pickDefinedEntries(entries) {
  return Object.fromEntries(Object.entries(entries).filter(([, value]) => value !== undefined));
}

function validateLoginPayload(body = {}) {
  const email = asTrimmedString(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const role = asTrimmedString(body.role);

  if (!EMAIL_REGEX.test(email)) return validationResult(false, "Enter a valid email address");
  if (!password) return validationResult(false, "Password is required");
  if (!["Admin", "Doctor", "Patient"].includes(role)) return validationResult(false, "Invalid role selected");

  return validationResult(true, "", { email, password, role });
}

function validateRegisterPayload(body = {}) {
  const userData = sanitizeUserFields(body);
  const fieldError = validateCoreUserFields(userData) || ensurePassword(userData.password, "Password");
  if (fieldError) return validationResult(false, fieldError);

  if (userData.dateOfBirth && !validateDate(userData.dateOfBirth)) {
    return validationResult(false, "Invalid date of birth");
  }

  let doctorData = null;
  if (userData.role === "Doctor") {
    doctorData = sanitizeDoctorFields(body);
    const doctorError = validateDoctorFields(doctorData);
    if (doctorError) return validationResult(false, doctorError);
  }

  return validationResult(true, "", {
    ...userData,
    doctorData,
  });
}

function validateProfileUpdatePayload(body = {}) {
  const updateData = pickDefinedEntries({
    firstname: body.firstname !== undefined ? asTrimmedString(body.firstname) : undefined,
    lastname: body.lastname !== undefined ? asTrimmedString(body.lastname) : undefined,
    phone: body.phone !== undefined ? normalizePhone(body.phone).slice(0, 10) : undefined,
    city: body.city !== undefined ? asTrimmedString(body.city) : undefined,
    dateOfBirth: body.dateOfBirth !== undefined ? (body.dateOfBirth ? new Date(body.dateOfBirth) : null) : undefined,
    gender: body.gender !== undefined ? asTrimmedString(body.gender).toLowerCase() : undefined,
    bloodGroup: body.bloodGroup !== undefined ? asTrimmedString(body.bloodGroup).toUpperCase() : undefined,
    pic: body.pic !== undefined ? asTrimmedString(body.pic) : undefined,
    permanentAddress: body.permanentAddress !== undefined ? asTrimmedString(body.permanentAddress) : undefined,
    temporaryAddress: body.temporaryAddress !== undefined ? asTrimmedString(body.temporaryAddress) : undefined,
    emergencyContact: body.emergencyContact !== undefined ? sanitizeEmergencyContact(body.emergencyContact) : undefined,
  });

  if ("firstname" in updateData && updateData.firstname.length < 2) {
    return validationResult(false, "First name must be at least 2 characters long");
  }
  if ("lastname" in updateData && updateData.lastname.length < 2) {
    return validationResult(false, "Last name must be at least 2 characters long");
  }
  if ("phone" in updateData && updateData.phone && !PHONE_REGEX.test(updateData.phone)) {
    return validationResult(false, "Phone number must be 10 digits");
  }
  if ("gender" in updateData && !VALID_GENDERS.has(updateData.gender)) {
    return validationResult(false, "Invalid gender value");
  }
  if ("bloodGroup" in updateData && !VALID_BLOOD_GROUPS.has(updateData.bloodGroup)) {
    return validationResult(false, "Invalid blood group value");
  }
  if ("dateOfBirth" in updateData && updateData.dateOfBirth && !validateDate(updateData.dateOfBirth)) {
    return validationResult(false, "Invalid date of birth");
  }

  return validationResult(true, "", updateData);
}

function validateChangePasswordPayload(body = {}) {
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  const confirmNewPassword = typeof body.confirmNewPassword === "string" ? body.confirmNewPassword : "";

  if (!currentPassword) return validationResult(false, "Current password is required");
  const passwordError = ensurePassword(newPassword, "New password");
  if (passwordError) return validationResult(false, passwordError);
  if (newPassword !== confirmNewPassword) return validationResult(false, "Passwords do not match");

  return validationResult(true, "", { currentPassword, newPassword });
}

function validateForgotPasswordPayload(body = {}) {
  const email = asTrimmedString(body.email).toLowerCase();
  if (!EMAIL_REGEX.test(email)) return validationResult(false, "Enter a valid email address");
  return validationResult(true, "", { email });
}

function validateResetPasswordPayload(body = {}) {
  const password = typeof body.password === "string" ? body.password : "";
  const passwordError = ensurePassword(password, "Password");
  if (passwordError) return validationResult(false, passwordError);
  return validationResult(true, "", { password });
}

module.exports = {
  validateLoginPayload,
  validateRegisterPayload,
  validateProfileUpdatePayload,
  validateChangePasswordPayload,
  validateForgotPasswordPayload,
  validateResetPasswordPayload,
};
