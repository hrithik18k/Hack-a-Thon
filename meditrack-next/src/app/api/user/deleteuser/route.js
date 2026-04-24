export const dynamic = "force-dynamic";

import userController from "@/controllers/userController";
import { withController } from "@/lib/routeHandler";

export const DELETE = withController(userController.deleteuser, {
  authRequired: true,
  roles: ["Admin"],
});
