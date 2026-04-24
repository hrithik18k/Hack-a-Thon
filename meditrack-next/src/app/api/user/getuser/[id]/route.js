export const dynamic = "force-dynamic";

import userController from "@/controllers/userController";
import { withController } from "@/lib/routeHandler";

export const GET = withController(userController.getuser, { authRequired: true });
