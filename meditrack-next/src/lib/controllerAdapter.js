import dbConnect from "./dbConnect";

export async function runController(controller, request, { params = {}, auth = null } = {}) {
  await dbConnect();

  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());
  let body = {};

  if (!["GET", "HEAD"].includes(request.method)) {
    try {
      body = await request.json();
    } catch (error) {
      body = {};
    }
  }

  return new Promise((resolve) => {
    const res = {
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

    const req = {
      body,
      query,
      params,
      headers: {
        authorization: request.headers.get("authorization") || "",
      },
      locals: auth?.userId,
      userRole: auth?.role,
    };

    Promise.resolve(controller(req, res)).catch(() => {
      resolve(Response.json({ success: false, message: "Internal Server Error" }, { status: 500 }));
    });
  });
}
