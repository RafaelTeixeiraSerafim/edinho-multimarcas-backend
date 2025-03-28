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

const usersRoutes = Router();

const createUserController = new CreateUserController();

const updateUserController = new UpdateUserController();

const listUsersController = new ListUsersController();

const deleteUserController = new DeleteUserController();

const authenticateUserController = new AuthenticateUserController();

const refreshTokenController = new RefreshTokenController();

usersRoutes.post(
  "/",
  optionalAuthenticate,
  validateDTO(CreateUserDTO),
  createUserController.handle
);

usersRoutes.patch(
  "/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  validateDTO(UpdateUserDTO),
  updateUserController.handle
);

usersRoutes.delete(
  "/:id",
  ensureAuthenticated,
  validatePathParams(IdPathParamDTO),
  deleteUserController.handle
);

usersRoutes.get(
  "/",
  ensureAuthenticated,
  validateQueryParams(PaginationQueryDTO),
  listUsersController.handle
);

usersRoutes.post(
  "/auth",
  validateDTO(AuthenticateUserDTO),
  authenticateUserController.handle
);

usersRoutes.post(
  "/auth/refresh-token",
  validateDTO(RefreshTokenDTO),
  refreshTokenController.handle
);

export { usersRoutes };
