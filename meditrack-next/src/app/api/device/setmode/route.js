export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import deviceController from "@/controllers/deviceController";

export async function POST(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(deviceController.setMode, request, { params: context?.params || {}, auth });
}

