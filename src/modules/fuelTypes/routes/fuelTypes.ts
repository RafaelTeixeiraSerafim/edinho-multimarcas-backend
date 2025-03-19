import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { validateDTO } from "@shared/infra/http/middlewares/validateDTO";
import { Router } from "express";
import { CreateFuelTypeDTO } from "../dtos/CreateFuelTypeDTO";
import { CreateFuelTypeController } from "../useCases/createFuelType/CreateFuelTypeController";
import { validatePathParams } from "@shared/infra/http/middlewares/validatePathParams";
import { IdPathParamDTO } from "@shared/dtos/IdPathParamDTO";
import { UpdateFuelTypeDTO } from "../dtos/UpdateFuelTypeDTO";
import { UpdateFuelTypeController } from "../useCases/updateFuelType/UpdateFuelTypeController";
import { DeleteFuelTypeController } from "../useCases/DeleteFuelType/DeleteFuelTypeController";
import { validateQueryParams } from "@shared/infra/http/middlewares/validateQueryParams";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
import { ListFuelTypesController } from "../useCases/listFuelTypes/ListFuelTypesController";

const createFuelTypeController = new CreateFuelTypeController();

const updateFuelTypeController = new UpdateFuelTypeController();

const deleteFuelTypeController = new DeleteFuelTypeController();

const listFuelTypesController = new ListFuelTypesController();

const fuelTypeRoutes = Router();

fuelTypeRoutes.post(
  "/",
  ensureAuthenticated,
  validateDTO(CreateFuelTypeDTO),
  createFuelTypeController.handle
);

fuelTypeRoutes.patch(
  "/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  validateDTO(UpdateFuelTypeDTO),
  updateFuelTypeController.handle
);

fuelTypeRoutes.delete(
  "/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  deleteFuelTypeController.handle
);

fuelTypeRoutes.get(
  "/",
  ensureAuthenticated,
  validateQueryParams(PaginationQueryDTO),
  listFuelTypesController.handle
);

export { fuelTypeRoutes };
