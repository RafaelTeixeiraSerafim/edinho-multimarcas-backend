import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { validateDTO } from "@shared/infra/http/middlewares/validateDTO";
import { Router } from "express";
import { CreateFuelTypeDTO } from "../dtos/CreateFuelTypeDTO";
import { CreateFuelTypeController } from "../useCases/createFuelType/CreateFuelTypeController";
import { validatePathParams } from "@shared/infra/http/middlewares/validatePathParams";
import { IdPathParamDTO } from "@shared/dtos/IdPathParamDTO";
import { UpdateFuelTypeDTO } from "../dtos/UpdateFuelTypeDTO";
import { UpdateFuelTypeController } from "../useCases/updateFuelType/UpdateFuelTypeController";
import { DeleteFuelTypeController } from "../useCases/deleteFuelType/DeleteFuelTypeController";
import { validateQueryParams } from "@shared/infra/http/middlewares/validateQueryParams";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
import { ListFuelTypesController } from "../useCases/listFuelTypes/ListFuelTypesController";

const createFuelTypeController = new CreateFuelTypeController();

const updateFuelTypeController = new UpdateFuelTypeController();

const deleteFuelTypeController = new DeleteFuelTypeController();

const listFuelTypesController = new ListFuelTypesController();

const fuelTypesRoutes = Router();

fuelTypesRoutes.post(
  "/fuel-types",
  ensureAuthenticated,
  validateDTO(CreateFuelTypeDTO),
  createFuelTypeController.handle
);

fuelTypesRoutes.patch(
  "/fuel-types/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  validateDTO(UpdateFuelTypeDTO),
  updateFuelTypeController.handle
);

fuelTypesRoutes.delete(
  "/fuel-types/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  deleteFuelTypeController.handle
);

fuelTypesRoutes.get(
  "/fuel-types",
  validateQueryParams(PaginationQueryDTO),
  listFuelTypesController.handle
);

export { fuelTypesRoutes };
