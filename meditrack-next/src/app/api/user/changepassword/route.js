export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import userController from "@/controllers/userController";

export async function PUT(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(userController.changepassword, request, { params: context?.params || {}, auth });
}

