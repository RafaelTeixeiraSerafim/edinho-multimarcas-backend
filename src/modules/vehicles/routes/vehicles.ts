import { Router } from "express";
import { CreateVehicleController } from "../useCases/createVehicle/CreateVehicleController";
import { validateDTO } from "@shared/infra/http/middlewares/validateDTO";
import { CreateVehicleDTO } from "../dtos/CreateVehicleDTO";

const vehicleRoutes = Router();

const createVehicleController = new CreateVehicleController();

vehicleRoutes.post(
  "/create",
  validateDTO(CreateVehicleDTO),
  createVehicleController.handle
);

export { vehicleRoutes };
