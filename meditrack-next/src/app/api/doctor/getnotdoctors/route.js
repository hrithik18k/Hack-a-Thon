export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import doctorController from "@/controllers/doctorController";

export async function GET(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(doctorController.getnotdoctors, request, { params: context?.params || {}, auth });
}

