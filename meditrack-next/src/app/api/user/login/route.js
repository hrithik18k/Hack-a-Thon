export const dynamic = "force-dynamic";

import { runController } from "@/lib/controllerAdapter";
import userController from "@/controllers/userController";
import { setAuthCookie } from "@/lib/session";

export async function POST(request, context) {
  const response = await runController(userController.login, request, { params: context?.params || {} });
  const payload = await response.json();

  if (!payload?.success || !payload?.data?.token) {
    return Response.json(payload, { status: response.status });
  }

  const authenticatedResponse = Response.json(
    {
      ...payload,
      data: {
        user: payload.data.user,
      },
    },
    { status: response.status }
  );

  return setAuthCookie(authenticatedResponse, payload.data.token);
}
