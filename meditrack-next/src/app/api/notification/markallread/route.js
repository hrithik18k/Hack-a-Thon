export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import notificationController from "@/controllers/notificationController";

export async function PUT(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(notificationController.markAllRead, request, { params: context?.params || {}, auth });
}

