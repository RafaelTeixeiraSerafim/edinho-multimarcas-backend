import { brandsRoutes as brandRoutes } from "@modules/brands/routes/brands";
import { fuelTypeRoutes } from "@modules/fuelTypes/routes/fuelTypes";
import { modelRoutes } from "@modules/models/routes/models";
import { usersRoutes as userRoutes } from "@modules/users/routes/users";
import { vehicleRoutes } from "@modules/vehicles/routes/vehicles";
import { Router } from "express";

const routes = Router();

routes.use("/vehicles", vehicleRoutes);
routes.use("/users", userRoutes);
routes.use("/fuel-types", fuelTypeRoutes);
routes.use("/brands", brandRoutes);
routes.use("/models", modelRoutes);

routes.get("/healthcheck", (_, response) => response.sendStatus(200));

export { routes };
