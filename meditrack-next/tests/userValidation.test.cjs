const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateLoginPayload,
  validateRegisterPayload,
  validateProfileUpdatePayload,
  validateChangePasswordPayload,
} = require("../src/lib/userValidation");

test("accepts valid login payloads", () => {
  const result = validateLoginPayload({
    email: "doctor@example.com",
    password: "supersecure",
    role: "Doctor",
  });

  assert.equal(result.isValid, true);
  assert.equal(result.data.email, "doctor@example.com");
});

test("rejects weak registration payloads", () => {
  const result = validateRegisterPayload({
    firstname: "A",
    lastname: "B",
    email: "invalid",
    password: "123",
    phone: "12",
    city: "",
    role: "Patient",
  });

  assert.equal(result.isValid, false);
});

test("requires doctor-specific fields for doctor registration", () => {
  const result = validateRegisterPayload({
    firstname: "Jane",
    lastname: "Doctor",
    email: "jane@example.com",
    password: "password123",
    phone: "9876543210",
    city: "Pune",
    role: "Doctor",
  });

  assert.equal(result.isValid, false);
  assert.match(result.message, /Specialization/);
});

test("whitelists profile updates", () => {
  const result = validateProfileUpdatePayload({
    firstname: "Jane",
    role: "Admin",
    password: "ignored",
    phone: "98765-43210",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.data, {
    firstname: "Jane",
    phone: "9876543210",
  });
});

test("requires strong new passwords", () => {
  const result = validateChangePasswordPayload({
    currentPassword: "old-password",
    newPassword: "short",
    confirmNewPassword: "short",
  });

  assert.equal(result.isValid, false);
  assert.match(result.message, /at least 8 characters/);
});
