export const dynamic = "force-dynamic";

import dbConnect from "@/lib/dbConnect";
import { verifyAuth } from "@/lib/auth";
import User from "@/models/userModel";

export async function GET(request) {
  const auth = verifyAuth(request);
  if (!auth) {
    return Response.json({ success: true, data: null });
  }

  await dbConnect();

  const user = await User.findById(auth.userId).select("-password");
  if (!user) {
    return Response.json({ success: false, message: "User not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: user });
}
