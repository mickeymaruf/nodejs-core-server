import { readUsers, writeUsers } from "../fileDb";
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

addRoutes("GET", "/users", async (req, res) => {
  const users = readUsers();

  sendJson(res, 201, {
    success: true,
    data: users,
    path: req.url,
  });
});

addRoutes("POST", "/users", async (req, res) => {
  const body = await parseBody(req);
  const newUser = body;

  const users = readUsers();
  const eixsts = users.some((u: any) => u.id === newUser.id);

  if (eixsts) {
    return sendJson(res, 404, {
      success: false,
      message: "User already exists!",
      path: req.url,
    });
  }

  users.push(newUser);
  writeUsers(users);

  sendJson(res, 201, {
    success: true,
    data: newUser,
    path: req.url,
  });
});

addRoutes("PUT", "/users/:id", async (req, res) => {
  const { id } = (req as any).params;
  const body = await parseBody(req);

  const users = readUsers();
  const index = users.findIndex((u: any) => u.id == id);

  if (index == -1) {
    return sendJson(res, 404, {
      success: false,
      message: "User not found!",
      path: req.url,
    });
  }

  delete body.id;
  users[index] = {
    ...users[index],
    ...body,
  };

  writeUsers(users);

  sendJson(res, 201, {
    success: true,
    data: body,
    path: req.url,
  });
});

addRoutes("DELETE", "/users/:id", (req, res) => {
  const { id } = (req as any).params;

  const users = readUsers();
  const exists = users.some((u: any) => u.id == id);

  if (!exists) {
    return sendJson(res, 404, {
      success: false,
      message: "User not found!",
      path: req.url,
    });
  }

  const newUsers = users.filter((u: any) => u.id != id);

  writeUsers(newUsers);

  sendJson(res, 201, {
    success: true,
    message: `User with id ${id} is deleted!`,
    path: req.url,
  });
});
