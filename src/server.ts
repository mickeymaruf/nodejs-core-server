import http, { IncomingMessage, ServerResponse } from "http";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;

    if (method === "GET" && url === "/") {
      res.end(
        JSON.stringify({
          success: true,
          message: "Hello from home route!!!",
          url,
        })
      );
    }
  }
);

server.listen(5000);
