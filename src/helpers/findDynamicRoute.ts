import { routes } from "./RouteHandler";

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

export default findDynamicRoute;
