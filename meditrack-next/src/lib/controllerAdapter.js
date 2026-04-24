import dbConnect from "./dbConnect.js";

function buildControllerRequest(request, { params = {}, auth = null } = {}, body) {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());

  return {
    body,
    query,
    params,
    method: request.method,
    headers: {
      authorization: request.headers.get("authorization") || "",
      cookie: request.headers.get("cookie") || "",
    },
    locals: auth?.userId,
    userRole: auth?.role,
  };
}

function createControllerResponse(resolve) {
  return {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      resolve(Response.json(payload, { status: this.statusCode }));
    },
    send(payload) {
      resolve(
        new Response(
          typeof payload === "string" ? payload : JSON.stringify(payload),
          { status: this.statusCode }
        )
      );
    },
  };
}

export async function runController(controller, request, { params = {}, auth = null } = {}) {
  await dbConnect();

  let body = {};

  if (!["GET", "HEAD"].includes(request.method)) {
    try {
      body = await request.json();
    } catch (error) {
      body = {};
    }
  }

  return new Promise((resolve) => {
    const res = createControllerResponse(resolve);
    const req = buildControllerRequest(request, { params, auth }, body);

    Promise.resolve(controller(req, res)).catch(() => {
      resolve(Response.json({ success: false, message: "Internal Server Error" }, { status: 500 }));
    });
  });
}
