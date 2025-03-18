import { usersRoutes } from "@modules/users/routes/users";
import { vehicleRoutes } from "@modules/vehicles/routes/vehicles";
import { Router } from "express";

const routes = Router();

routes.use("/vehicles", vehicleRoutes);
routes.use("/users", usersRoutes);

routes.get("/healthcheck", (_, response) =>
  response.sendStatus(200)
);

export { routes };
