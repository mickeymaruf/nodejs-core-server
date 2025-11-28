import http, { IncomingMessage, ServerResponse } from "http";
import { routes } from "./helpers/RouteHandler";
import "./helpers/routes";

const findDynamicRoute = (method: string, url: string) => {
  const methodMap = routes.get(method);
  if (!methodMap) return null;

  for (const [path, handler] of methodMap.entries()) {
    const routeParts = path.split("/");
    const urlParts = url.split("/");

    if (routeParts.length !== urlParts.length) continue;

    const params: any = {};
    let matched = true;

    for (let i = 0; i < routeParts.length; i++) {
      const part = routeParts[i];

      if (part?.startsWith(":")) {
        params[part.substring(1)] = urlParts[i];
      } else if (part !== urlParts[i]) {
        // Above we just did length check not actual path segments checks.
        // Here, Check each segment of the route.
        // Static segments must match exactly, otherwise this route is invalid.
        // Example: "/users/42" should NOT match "/posts/:postId" or "/admin/:section".
        // If a static segment doesn't match, we stop checking this route and move to the next one.
        matched = false;
        break;
      }
    }

    if (matched) {
      return { handler, params };
    }

    return null;
  }
};

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const method = req.method?.toUpperCase() || "";
    const url = req.url || "";

    const staticHandler = routes.get(method)?.get(url);

    if (staticHandler) {
      staticHandler(req, res);
    }
    // staticHandler returns undefined for dynamic routes
    // '/users/42' won't match '/users/:id'
    else if (findDynamicRoute(method, url)) {
      const match = findDynamicRoute(method!, url!);
      (req as any).params = match?.params;
      match?.handler(req, res);
    } else {
      res.statusCode = 404;
      res.end(
        JSON.stringify({
          success: false,
          message: "Route doesn't exist!!!",
          url,
        })
      );
    }
  }
);

server.listen(5000);
