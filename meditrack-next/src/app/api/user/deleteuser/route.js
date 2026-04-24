export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import userController from "@/controllers/userController";

export async function DELETE(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  const roleError = requireRole(auth, "Admin");
  if (roleError) return roleError;
  return runController(userController.deleteuser, request, { params: context?.params || {}, auth });
}

