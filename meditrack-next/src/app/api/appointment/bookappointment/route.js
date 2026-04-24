export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import appointmentController from "@/controllers/appointmentController";

export async function POST(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(appointmentController.bookappointment, request, { params: context?.params || {}, auth });
}

