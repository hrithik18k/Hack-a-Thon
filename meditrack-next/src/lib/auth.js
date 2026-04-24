import jwt from "jsonwebtoken";

export function json(data, status = 200) {
  return Response.json(data, { status });
}

export function getBearerToken(request) {
  const authHeader = request.headers.get("authorization") || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
}

export function verifyAuth(request) {
  try {
    const token = getBearerToken(request);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
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
