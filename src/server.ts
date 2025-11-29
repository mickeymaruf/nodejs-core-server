import http, { IncomingMessage, ServerResponse } from "http";
import { routes } from "./helpers/RouteHandler";
import "./helpers/routes";
import findDynamicRoute from "./helpers/findDynamicRoute";

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
