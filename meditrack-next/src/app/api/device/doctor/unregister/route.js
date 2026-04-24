export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import deviceController from "@/controllers/deviceController";

export async function DELETE(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(deviceController.unregisterDevice, request, { params: context?.params || {}, auth });
}

