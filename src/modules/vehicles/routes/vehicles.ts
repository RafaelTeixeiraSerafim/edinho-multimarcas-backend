import { UpdateVehicleDTO } from "@modules/vehicles/dtos/UpdateVehicleDTO";
import { IdPathParamDTO } from "@shared/dtos/IdPathParamDTO";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { validateDTO } from "@shared/infra/http/middlewares/validateDTO";
import { validatePathParams } from "@shared/infra/http/middlewares/validatePathParams";
import { Router } from "express";
import { CreateVehicleDTO } from "../dtos/CreateVehicleDTO";
import { CreateVehicleController } from "../useCases/createVehicle/CreateVehicleController";
import { UpdateVehicleController } from "../useCases/updateVehicle/UpdateVehicleController";
import { validateQueryParams } from "@shared/infra/http/middlewares/validateQueryParams";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
import { ListVehiclesController } from "../useCases/listVehicles/ListVehiclesController";
import { DeleteVehicleController } from "../useCases/deleteVehicle/DeleteVehicleController";
import { GetVehiclesByModelIdController } from "../useCases/getVehiclesByModelId/GetVehiclesByModelIdController";
import { ModelIdPathParamDTO } from "../dtos/ModelIdPathParamDTO";

const createVehicleController = new CreateVehicleController();

const updateVehicleController = new UpdateVehicleController();

const deleteVehicleController = new DeleteVehicleController();

const listVehiclesController = new ListVehiclesController();

const getVehiclesByModelIdController = new GetVehiclesByModelIdController();

const vehicleRoutes = Router();

vehicleRoutes.post(
  "/vehicles",
  ensureAuthenticated,
  validateDTO(CreateVehicleDTO),
  createVehicleController.handle
);

vehicleRoutes.patch(
  "/vehicles/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  validateDTO(UpdateVehicleDTO),
  updateVehicleController.handle
);

vehicleRoutes.delete(
  "/vehicles/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  deleteVehicleController.handle
);

vehicleRoutes.get(
  "/vehicles",
  validateQueryParams(PaginationQueryDTO),
  listVehiclesController.handle
);

vehicleRoutes.get(
  "/models/:modelId/vehicles",
  validatePathParams(ModelIdPathParamDTO),
  getVehiclesByModelIdController.handle
);

export { vehicleRoutes };
