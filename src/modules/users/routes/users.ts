import { Router } from "express";
import { CreateUserController } from "../useCases/createUser/CreateUserController";
import { UpdateUserController } from "../useCases/updateUser/UpdateUserController";
import { ListUsersController } from "../useCases/listUsers/ListUsersController";
import { validateDTO } from "@shared/infra/http/middlewares/validateDTO";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { validateQueryParams } from "@shared/infra/http/middlewares/validateQueryParams";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
import { UpdateUserDTO } from "../dtos/UpdateUserDTO";
import { validatePathParams } from "@shared/infra/http/middlewares/validatePathParams";
import { IdPathParamDTO } from "@shared/dtos/IdPathParamDTO";
import { DeleteUserController } from "../useCases/deleteUser/DeleteUserController";
import { AuthenticateUserController } from "../useCases/authenticateUser/AuthenticateUserController";
import { AuthenticateUserDTO } from "../dtos/AuthenticateUserDTO";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { RefreshTokenDTO } from "../dtos/RefreshTokenDTO";
import { RefreshTokenController } from "../useCases/refreshToken/RefreshTokenController";
import { optionalAuthenticate } from "@shared/infra/http/middlewares/optionalAuthenticate";
import { ResetPasswordDTO } from "../dtos/ResetPasswordDTO";
import { ResetPasswordController } from "../useCases/resetPassword/ResetPasswordController";

const usersRoutes = Router();

const createUserController = new CreateUserController();

const updateUserController = new UpdateUserController();

const listUsersController = new ListUsersController();

const deleteUserController = new DeleteUserController();

const authenticateUserController = new AuthenticateUserController();

const refreshTokenController = new RefreshTokenController();

const resetPasswordController = new ResetPasswordController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

usersRoutes.post(
  "/users",
  optionalAuthenticate,
  validateDTO(CreateUserDTO),
  createUserController.handle
);

usersRoutes.patch(
  "/users/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  validateDTO(UpdateUserDTO),
  updateUserController.handle
);

usersRoutes.delete(
  "/users/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  deleteUserController.handle
);

usersRoutes.get(
  "/users",
  ensureAuthenticated,
  validateQueryParams(PaginationQueryDTO),
  listUsersController.handle
);

/**
 * @swagger
 * /api/v1/users/auth:
 *   post:
 *     tags: [Users]
 *     summary: Cria uma nova sessão de usuário
 *     description: Cria uma nova sessão de usuário com base nas credenciais fornecidas.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthenticateUserDTO'
 *     responses:
 *       201:
 *         description: Sessão criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticateUserResponseDTO'
 *       400:
 *         description: Dados inválidos ou não fornecidos
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
usersRoutes.post(
  "/users/auth",
  validateDTO(AuthenticateUserDTO),
  authenticateUserController.handle
);

usersRoutes.post(
  "/users/auth/refresh-token",
  validateDTO(RefreshTokenDTO),
  refreshTokenController.handle
);

usersRoutes.post(
  "/users/auth/reset-password",
  validateDTO(ResetPasswordDTO),
  resetPasswordController.handle
);

export { usersRoutes };
