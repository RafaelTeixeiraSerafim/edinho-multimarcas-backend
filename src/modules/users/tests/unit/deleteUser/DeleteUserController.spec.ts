import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UnauthorizedError } from "@shared/infra/http/errors";
import { DeleteUserController } from "@modules/users/useCases/deleteUser/DeleteUserController";
import { DeleteUserUseCase } from "@modules/users/useCases/deleteUser/DeleteUserUseCase";

// Mock the use case
jest.mock("@modules/users/useCases/deleteUser/DeleteUserUseCase");

describe("DeleteUserController", () => {
  let deleteUserController: DeleteUserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockDeleteUserUseCase: jest.Mocked<DeleteUserUseCase>;

  const mockUser = {
    id: "user-id",
    name: "John Doe",
    email: "john.doe@example.com",
    isDeleted: false,
    password: "hashedPassword123",
    refreshToken: "refreshToken123",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    createdById: null,
    updatedById: null,
    deletedById: null,
    birthdate: null,
    contact: null,
    nationalId: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();
    deleteUserController = new DeleteUserController();

    mockRequest = {
      params: { id: "user-id" },
      user: mockUser,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();

    mockDeleteUserUseCase = {
      execute: jest.fn(),
    } as any;

    jest.spyOn(container, "resolve").mockReturnValue(mockDeleteUserUseCase);
  });

  it("deve deletar um usuário com sucesso e retornar status 204", async () => {
    await deleteUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(container.resolve).toHaveBeenCalledWith(DeleteUserUseCase);
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith(
      "user-id",
      "user-id"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.json).toHaveBeenCalledWith({});
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await deleteUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockDeleteUserUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Erro de teste");
    mockDeleteUserUseCase.execute.mockRejectedValue(mockError);

    await deleteUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve usar o ID do usuário autenticado para a deleção", async () => {
    const specificUserId = "specific-user-id";
    mockRequest.user = { ...mockUser, id: specificUserId };
    mockRequest.params = { id: specificUserId };

    await deleteUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith(
      specificUserId,
      specificUserId
    );
  });

  it("deve usar o ID do usuário dos parâmetros da requisição", async () => {
    const specificUserId = "specific-user-id";
    mockRequest.params = { id: specificUserId };

    await deleteUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith(
      specificUserId,
      "user-id"
    );
  });
});
