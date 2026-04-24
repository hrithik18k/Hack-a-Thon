import { getCookieToken, verifyAuthToken } from "./session.js";

export function json(data, status = 200) {
  return Response.json(data, { status });
}

export function getBearerToken(request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return "";
  const token = authHeader.slice(7).trim();
  if (!token || token === "null" || token === "undefined") return "";
  return token;
}

export function getAuthToken(request) {
  return getBearerToken(request) || getCookieToken(request);
}

export function verifyAuth(request) {
  try {
    const token = getAuthToken(request);
    if (!token) return null;
    const decoded = verifyAuthToken(token);
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    return null;
  }
}

export function requireAuth(request) {
  const auth = verifyAuth(request);
  if (!auth) return { error: json({ success: false, message: "Unauthorized: Invalid token" }, 401) };
  return { auth };
}

export function requireRole(auth, ...roles) {
  if (!auth?.role || !roles.includes(auth.role)) {
    return json({ success: false, message: "Forbidden: insufficient permissions" }, 403);
  }
  return null;
}
