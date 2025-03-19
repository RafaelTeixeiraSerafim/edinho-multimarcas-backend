import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { validateDTO } from "@shared/infra/http/middlewares/validateDTO";
import { Router } from "express";
import { CreateFuelTypeDTO } from "../dtos/CreateFuelTypeDTO";
import { CreateFuelTypeController } from "../useCases/CreateFuelTypeController";

const createFuelTypeController = new CreateFuelTypeController();

const fuelTypeRoutes = Router();

fuelTypeRoutes.post(
  "/",
  ensureAuthenticated,
  validateDTO(CreateFuelTypeDTO),
  createFuelTypeController.handle
);

export { fuelTypeRoutes };
