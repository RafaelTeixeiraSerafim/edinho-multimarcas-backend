import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { validateDTO } from "@shared/infra/http/middlewares/validateDTO";
import { Router } from "express";
import { CreateBrandDTO } from "../dtos/CreateBrandDTO";
import { CreateBrandController } from "../useCases/createBrand/CreateBrandController";

const createBrandController = new CreateBrandController();

const brandsRoutes = Router();

brandsRoutes.post(
  "/",
  ensureAuthenticated,
  validateDTO(CreateBrandDTO),
  createBrandController.handle
);

export { brandsRoutes };
