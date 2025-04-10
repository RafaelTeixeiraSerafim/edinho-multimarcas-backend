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

const vehiclesRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
 */

/**
 * @swagger
 * /api/v1/vehicles:
 *   post:
 *     tags: [Vehicles]
 *     summary: Criar um novo veículo
 *     description: Criar um novo veículo no sistema.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVehicleDTO'
 *     responses:
 *       201:
 *         description: Veículo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponseDTO'
 *       400:
 *         description: Dados inválidos ou faltando
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               BadRequestError:
 *                 $ref: '#/components/examples/BadRequest'
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               UnauthorizedError:
 *                 $ref: '#/components/examples/Unauthorized'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InternalServerError:
 *                 $ref: '#/components/examples/InternalServer'
 */
vehiclesRoutes.post(
  "/vehicles",
  ensureAuthenticated,
  validateDTO(CreateVehicleDTO),
  createVehicleController.handle
);

vehiclesRoutes.patch(
  "/vehicles/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  validateDTO(UpdateVehicleDTO),
  updateVehicleController.handle
);

vehiclesRoutes.delete(
  "/vehicles/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  deleteVehicleController.handle
);

vehiclesRoutes.get(
  "/vehicles",
  validateQueryParams(PaginationQueryDTO),
  listVehiclesController.handle
);

vehiclesRoutes.get(
  "/models/:modelId/vehicles",
  validatePathParams(ModelIdPathParamDTO),
  getVehiclesByModelIdController.handle
);

export { vehiclesRoutes };
