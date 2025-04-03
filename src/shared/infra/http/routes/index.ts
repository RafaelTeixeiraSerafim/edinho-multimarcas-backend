import { brandsRoutes as brandRoutes } from "@modules/brands/routes/brands";
import { fuelTypeRoutes } from "@modules/fuelTypes/routes/fuelTypes";
import { modelRoutes } from "@modules/models/routes/models";
import { usersRoutes as userRoutes } from "@modules/users/routes/users";
import { vehicleRoutes } from "@modules/vehicles/routes/vehicles";
import { Router } from "express";

const routes = Router();

const routePreset = "/api/v1";

routes.use(routePreset, vehicleRoutes);
routes.use(routePreset, userRoutes);
routes.use(routePreset, fuelTypeRoutes);
routes.use(routePreset, brandRoutes);
routes.use(routePreset, modelRoutes);

routes.get(routePreset + "/healthcheck", (_, response) =>
  response.sendStatus(200)
);

export { routes };
