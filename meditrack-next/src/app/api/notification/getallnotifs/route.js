export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import notificationController from "@/controllers/notificationController";

export async function GET(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(notificationController.getallnotifs, request, { params: context?.params || {}, auth });
}

