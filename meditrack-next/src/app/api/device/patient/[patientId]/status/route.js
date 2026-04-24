export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import deviceController from "@/controllers/deviceController";

export async function GET(request, context) {
  const { auth, error } = requireAuth(request);
  if (error) return error;

  const roleError = requireRole(auth, "Doctor");
  if (roleError) return roleError;

  return runController(deviceController.getPatientFingerprintStatus, request, {
    params: context?.params || {},
    auth,
  });
}
