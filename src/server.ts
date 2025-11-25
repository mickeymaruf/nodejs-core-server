import http, { IncomingMessage, ServerResponse } from "http";
import addRoutes, { routes } from "./helpers/RouteHandler";

addRoutes("GET", "/", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      success: true,
      message: "Hello from node.js server!",
      path: req.url,
    })
  );
});

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
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
    // if (method === "POST" && url === "/users") {
    //   let body: any;
    //   req.on("error", (err) => {
    //     console.error(err);
    //   });
    //   req.on("data", (chunk) => {
    //     body = chunk.toString();
    //   });
    //   req.on("end", () => {
    //     const data = JSON.parse(body);

    //     res.statusCode = 200;
    //     res.setHeader("Content-Type", "application/json");
    //     res.end(JSON.stringify({ success: true, data, url }));
    //   });
    //   return;
    // }
  }
);

server.listen(5000);
