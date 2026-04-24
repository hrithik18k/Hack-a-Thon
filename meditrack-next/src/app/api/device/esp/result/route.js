export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import deviceController from "@/controllers/deviceController";

export async function POST(request, context) {
  return runController(deviceController.postResultESP, request, { params: context?.params || {} });
}

