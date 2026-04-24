import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "meditrack_session";
export const AUTH_MAX_AGE_SECONDS = 60 * 60 * 24 * 2;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

function parseCookieHeader(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((cookies, entry) => {
      const separatorIndex = entry.indexOf("=");
      if (separatorIndex === -1) return cookies;
      const key = entry.slice(0, separatorIndex).trim();
      const value = entry.slice(separatorIndex + 1).trim();
      cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});
}

export function signAuthToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: AUTH_MAX_AGE_SECONDS });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function getCookieToken(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parseCookieHeader(cookieHeader);
  return cookies[AUTH_COOKIE_NAME] || "";
}

export function createAuthCookie(token) {
  const attributes = [
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${AUTH_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (process.env.NODE_ENV === "production") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

export function createClearedAuthCookie() {
  const attributes = [
    `${AUTH_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (process.env.NODE_ENV === "production") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

export function setAuthCookie(response, token) {
  response.headers.append("Set-Cookie", createAuthCookie(token));
  return response;
}

export function clearAuthCookie(response) {
  response.headers.append("Set-Cookie", createClearedAuthCookie());
  return response;
}
