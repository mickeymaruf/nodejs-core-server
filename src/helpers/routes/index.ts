import parseBody from "../parseBody";
import addRoutes from "../RouteHandler";
import sendJson from "../sendJson";

addRoutes("GET", "/", (req, res) => {
  sendJson(res, 200, {
    success: true,
    message: "Hello from node.js server!",
    path: req.url,
  });
});

addRoutes("POST", "/users", async (req, res) => {
  const body = await parseBody(req);

  sendJson(res, 201, {
    success: true,
    data: body,
    path: req.url,
  });
});

addRoutes("PUT", "/users/:id", async (req, res) => {
  const { id } = (req as any).params;
  const body = await parseBody(req);

  console.log(id);

  sendJson(res, 201, {
    success: true,
    data: body,
    path: req.url,
  });
});
