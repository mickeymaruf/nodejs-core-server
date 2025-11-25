import { IncomingMessage, ServerResponse } from "http";

type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void;
export const routes: Map<string, Map<string, RouteHandler>> = new Map();

const addRoutes = (method: string, path: string, handler: RouteHandler) => {
  if (!routes.has(method)) routes.set(method, new Map());
  routes.get(method)!.set(path, handler);
};

export default addRoutes;

/* example routes

routes = {
  GET: {
    "/": handlerHome,
    "/users": handlerListUsers,
    "/users/:id": handlerGetUser
  },
  POST: {
    "/login": handlerLogin,
    "/users": handlerCreateUser
  },
  PUT: {
    "/users/:id": handlerUpdateUser
  },
  DELETE: {
    "/users/:id": handlerDeleteUser
  }
}
*/
