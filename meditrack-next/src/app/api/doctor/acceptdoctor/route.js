export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import doctorController from "@/controllers/doctorController";

export async function PUT(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  const roleError = requireRole(auth, "Admin");
  if (roleError) return roleError;
  return runController(doctorController.acceptdoctor, request, { params: context?.params || {}, auth });
}

