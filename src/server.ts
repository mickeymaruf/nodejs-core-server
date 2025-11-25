import http, { IncomingMessage, ServerResponse } from "http";
import { routes } from "./helpers/RouteHandler";
import "./helpers/routes";

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;

    const handler = routes.get(method!.toUpperCase() || "")?.get(url || "");

    if (handler) {
      handler(req, res);
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
