export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import { requireAuth, requireRole } from "@/lib/auth";
import userController from "@/controllers/userController";

export async function POST(request, context) {
  return runController(userController.forgotpassword, request, { params: context?.params || {} });
}

