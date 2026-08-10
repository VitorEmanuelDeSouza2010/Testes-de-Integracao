import { Router } from "express";

import usersController from "./controllers/users";
import { isIdValid } from "./middlewares/validation";

const routes = Router();

routes.get("/", (request, response) =>
  response.status(200).json({ success: true }),
);

routes.post("/users/login", usersController.login);
routes.get("/users", usersController.list);
routes.get("/users/:id", isIdValid, usersController.getById);
routes.post("/users", usersController.create);
routes.put("/users/:id", isIdValid, usersController.update);
routes.delete("/users/:id", isIdValid, usersController.delete);

export default routes;
