export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import deviceController from "@/controllers/deviceController";

export async function GET(request, context) {
  return runController(deviceController.getModeESP, request, { params: context?.params || {} });
}

