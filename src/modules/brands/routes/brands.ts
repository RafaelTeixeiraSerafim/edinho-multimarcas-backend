import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { validateDTO } from "@shared/infra/http/middlewares/validateDTO";
import { Router } from "express";
import { CreateBrandDTO } from "../dtos/CreateBrandDTO";
import { CreateBrandController } from "../useCases/createBrand/CreateBrandController";
import { IdPathParamDTO } from "@shared/dtos/IdPathParamDTO";
import { UpdateBrandDTO } from "../dtos/UpdateBrandDTO";
import { UpdateBrandController } from "../useCases/updateBrand/UpdateBrandController";
import { validatePathParams } from "@shared/infra/http/middlewares/validatePathParams";
import { validateQueryParams } from "@shared/infra/http/middlewares/validateQueryParams";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
import { ListBrandsController } from "../useCases/listBrands/ListBrandsController";
import { DeleteBrandController } from "../useCases/deleteBrand/DeleteBrandController";

const createBrandController = new CreateBrandController();

const updateBrandController = new UpdateBrandController();

const listBrandsController = new ListBrandsController();

const deleteBrandController = new DeleteBrandController();

const brandsRoutes = Router();

brandsRoutes.post(
  "/brands",
  ensureAuthenticated,
  validateDTO(CreateBrandDTO),
  createBrandController.handle
);

brandsRoutes.patch(
  "/brands/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  validateDTO(UpdateBrandDTO),
  updateBrandController.handle
);

brandsRoutes.delete(
  "/brands/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  deleteBrandController.handle
);

brandsRoutes.get(
  "/brands",
  validateQueryParams(PaginationQueryDTO),
  listBrandsController.handle
);

export { brandsRoutes };
