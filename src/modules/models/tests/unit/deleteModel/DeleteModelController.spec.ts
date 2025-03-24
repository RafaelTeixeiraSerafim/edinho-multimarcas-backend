import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UnauthorizedError } from "@shared/infra/http/errors";
import { DeleteModelController } from "@modules/models/useCases/deleteModel/DeleteModelController";
import { DeleteModelUseCase } from "@modules/models/useCases/deleteModel/DeleteModelUseCase";

// Mock the use case with proper module path
jest.mock("@modules/models/useCases/deleteModel/DeleteModelUseCase");

describe("DeleteModelController", () => {
  let deleteModelController: DeleteModelController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockDeleteModelUseCase: jest.Mocked<DeleteModelUseCase>;

  // Complete user object
  const mockUser = {
    id: "user-id",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "hashedPassword123",
    refreshToken: "refreshToken123",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: false,
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

    // Create mock instance
    mockDeleteModelUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock the constructor
    (DeleteModelUseCase as jest.Mock).mockImplementation(() => mockDeleteModelUseCase);

    deleteModelController = new DeleteModelController();

    mockRequest = {
      params: { id: "model-id" },
      user: mockUser,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("deve deletar um modelo com sucesso e retornar status 204", async () => {
    await deleteModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.json).toHaveBeenCalledWith({});
    expect(mockDeleteModelUseCase.execute).toHaveBeenCalledWith(
      "model-id",
      "user-id"
    );
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await deleteModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockDeleteModelUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Test error");
    mockDeleteModelUseCase.execute.mockRejectedValue(mockError);

    await deleteModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve usar o ID do usuário autenticado para a deleção", async () => {
    const specificUserId = "specific-user-id";
    mockRequest.user = { ...mockUser, id: specificUserId };

    await deleteModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockDeleteModelUseCase.execute).toHaveBeenCalledWith(
      "model-id",
      specificUserId
    );
  });

  it("deve usar o ID do modelo dos parâmetros da requisição", async () => {
    const specificModelId = "specific-model-id";
    mockRequest.params = { id: specificModelId };

    await deleteModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockDeleteModelUseCase.execute).toHaveBeenCalledWith(
      specificModelId,
      "user-id"
    );
  });
});