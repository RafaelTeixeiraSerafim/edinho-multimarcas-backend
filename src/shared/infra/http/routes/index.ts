import { brandsRoutes } from "@modules/brands/routes/brands";
import { fuelTypesRoutes } from "@modules/fuelTypes/routes/fuelTypes";
import { modelsRoutes } from "@modules/models/routes/models";
import { usersRoutes } from "@modules/users/routes/users";
import { vehiclesRoutes } from "@modules/vehicles/routes/vehicles";
import { Router } from "express";

const routes = Router();

const routePreset = "/api/v1";

routes.use(routePreset, vehiclesRoutes);
routes.use(routePreset, usersRoutes);
routes.use(routePreset, fuelTypesRoutes);
routes.use(routePreset, brandsRoutes);
routes.use(routePreset, modelsRoutes);

routes.get(routePreset + "/healthcheck", (_, response) =>
  response.sendStatus(200)
);

export { routes };
