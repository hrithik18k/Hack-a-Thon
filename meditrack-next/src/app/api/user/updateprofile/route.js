export const dynamic = "force-dynamic";

import userController from "@/controllers/userController";
import { withController } from "@/lib/routeHandler";

export const PUT = withController(userController.updateprofile, { authRequired: true });
