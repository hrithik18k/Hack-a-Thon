export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import doctorController from "@/controllers/doctorController";

export async function POST(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(doctorController.applyfordoctor, request, { params: context?.params || {}, auth });
}

