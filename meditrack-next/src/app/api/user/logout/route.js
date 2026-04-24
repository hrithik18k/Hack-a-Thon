export const dynamic = "force-dynamic";

import { clearAuthCookie } from "@/lib/session";

export async function POST() {
  const response = Response.json({ success: true, message: "Logged out successfully" });
  return clearAuthCookie(response);
}
