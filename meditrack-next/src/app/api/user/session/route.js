export const dynamic = "force-dynamic";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { json, requireAuth } from "@/lib/auth";

export async function GET(request) {
  const { auth, error } = requireAuth(request);
  if (error) return error;

  await dbConnect();
  const user = await User.findById(auth.userId).select("-password");
  if (!user) {
    return json({ success: false, message: "User not found" }, 404);
  }

  return json({ success: true, data: user });
}
