export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import userController from "@/controllers/userController";

export async function GET(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(userController.getuser, request, { params: context?.params || {}, auth });
}

