import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { validateDTO } from "@shared/infra/http/middlewares/validateDTO";
import { Router } from "express";
import { CreateModelController } from "../useCases/createModel/CreateModelController";
import { validatePathParams } from "@shared/infra/http/middlewares/validatePathParams";
import { IdPathParamDTO } from "@shared/dtos/IdPathParamDTO";
import { UpdateModelDTO } from "../dtos/UpdateModelDTO";
import { validateQueryParams } from "@shared/infra/http/middlewares/validateQueryParams";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
import { CreateModelDTO } from "../dtos/CreateModelDTO";
import { UpdateModelController } from "../useCases/updateModel/UpdateModelController";
import { DeleteModelController } from "../useCases/deleteModel/DeleteModelController";
import { ListModelsController } from "../useCases/listModels/ListModelsController";
import { BrandIdPathParamDTO } from "../dtos/BrandIdPathParamDTO";
import { GetModelsByBrandIdController } from "../useCases/getModelsByBrandId/GetModelsByBrandIdController";

const createModelController = new CreateModelController();

const updateModelController = new UpdateModelController();

const deleteModelController = new DeleteModelController();

const listModelsController = new ListModelsController();

const getModelByBrandIdController = new GetModelsByBrandIdController();

const modelsRoutes = Router();

modelsRoutes.post(
  "/models",
  ensureAuthenticated,
  validateDTO(CreateModelDTO),
  createModelController.handle
);

modelsRoutes.patch(
  "/models/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  validateDTO(UpdateModelDTO),
  updateModelController.handle
);

modelsRoutes.delete(
  "/models/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  deleteModelController.handle
);

modelsRoutes.get(
  "/models",
  validateQueryParams(PaginationQueryDTO),
  listModelsController.handle
);

modelsRoutes.get(
  "/brands/:brandId/models",
  validatePathParams(BrandIdPathParamDTO),
  getModelByBrandIdController.handle
);

export { modelsRoutes };
