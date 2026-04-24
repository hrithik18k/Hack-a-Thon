import { requireAuth, requireRole } from "./auth.js";
import { runController } from "./controllerAdapter.js";

export function withController(controller, options = {}) {
  const {
    authRequired = false,
    roles = [],
  } = options;

  return async function routeHandler(request, context) {
    let auth = null;

    if (authRequired) {
      const authResult = requireAuth(request);
      if (authResult.error) return authResult.error;
      auth = authResult.auth;
    }

    if (roles.length) {
      const roleError = requireRole(auth, ...roles);
      if (roleError) return roleError;
    }

    return runController(controller, request, {
      params: context?.params || {},
      auth,
    });
  };
}
