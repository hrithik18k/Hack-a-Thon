export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import doctorController from "@/controllers/doctorController";

export async function GET(request, context) {
  return runController(doctorController.getalldoctors, request, { params: context?.params || {} });
}

