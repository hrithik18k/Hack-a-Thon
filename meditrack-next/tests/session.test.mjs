import test from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET = "test-secret";

const sessionModule = await import("../src/lib/session.js");
const authModule = await import("../src/lib/auth.js");

const {
  AUTH_COOKIE_NAME,
  createAuthCookie,
  createClearedAuthCookie,
  getCookieToken,
  signAuthToken,
} = sessionModule;

const { getBearerToken, getAuthToken, verifyAuth } = authModule;

test("creates secure auth cookie attributes", () => {
  const cookie = createAuthCookie("sample-token");
  assert.match(cookie, new RegExp(`^${AUTH_COOKIE_NAME}=`));
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Max-Age=/);
});

test("creates a clearing auth cookie", () => {
  const cookie = createClearedAuthCookie();
  assert.match(cookie, /Max-Age=0/);
});

test("reads bearer token and ignores invalid placeholders", () => {
  const request = new Request("http://localhost/api/test", {
    headers: { authorization: "Bearer abc123" },
  });
  assert.equal(getBearerToken(request), "abc123");

  const invalidRequest = new Request("http://localhost/api/test", {
    headers: { authorization: "Bearer null" },
  });
  assert.equal(getBearerToken(invalidRequest), "");
});

test("falls back to cookie token when bearer header is absent", () => {
  const request = new Request("http://localhost/api/test", {
    headers: { cookie: `${AUTH_COOKIE_NAME}=cookie-token` },
  });
  assert.equal(getCookieToken(request), "cookie-token");
  assert.equal(getAuthToken(request), "cookie-token");
});

test("verifies auth from the session cookie", () => {
  const token = signAuthToken({ userId: "user-1", role: "Patient" });
  const request = new Request("http://localhost/api/test", {
    headers: { cookie: `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}` },
  });
  assert.deepEqual(verifyAuth(request), { userId: "user-1", role: "Patient" });
});
