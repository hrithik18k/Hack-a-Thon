export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import appointmentController from "@/controllers/appointmentController";

export async function PUT(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(appointmentController.completed, request, { params: context?.params || {}, auth });
}

