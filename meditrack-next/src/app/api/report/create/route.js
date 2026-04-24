export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import reportController from "@/controllers/reportController";

export async function POST(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;
  return runController(reportController.createReport, request, { params: context?.params || {}, auth });
}

