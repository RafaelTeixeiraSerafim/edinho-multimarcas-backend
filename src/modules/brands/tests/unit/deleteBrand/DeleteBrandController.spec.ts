import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UnauthorizedError } from "@shared/infra/http/errors";
import { DeleteBrandController } from "@modules/brands/useCases/deleteBrand/DeleteBrandController";
import { DeleteBrandUseCase } from "@modules/brands/useCases/deleteBrand/DeleteBrandUseCase";

// Mock the use case with proper module path
jest.mock("@modules/brands/useCases/deleteBrand/DeleteBrandUseCase");

describe("DeleteBrandController", () => {
  let deleteBrandController: DeleteBrandController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockDeleteBrandUseCase: jest.Mocked<DeleteBrandUseCase>;

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
    deleteBrandController = new DeleteBrandController();

    mockRequest = {
      params: { id: "brand-id" },
      user: mockUser,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();

    // Mock the use case instance
    mockDeleteBrandUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock container.resolve
    jest.spyOn(container, "resolve").mockReturnValue(mockDeleteBrandUseCase);
  });

  it("deve deletar uma marca com sucesso e retornar status 204", async () => {
    await deleteBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(container.resolve).toHaveBeenCalledWith(DeleteBrandUseCase);
    expect(mockDeleteBrandUseCase.execute).toHaveBeenCalledWith(
      "brand-id",
      "user-id"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.json).toHaveBeenCalledWith({});
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await deleteBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockDeleteBrandUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Test error");
    mockDeleteBrandUseCase.execute.mockRejectedValue(mockError);

    await deleteBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve usar o ID do usuário autenticado para a deleção", async () => {
    const specificUserId = "specific-user-id";
    mockRequest.user = { ...mockUser, id: specificUserId };

    await deleteBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockDeleteBrandUseCase.execute).toHaveBeenCalledWith(
      "brand-id",
      specificUserId
    );
  });

  it("deve usar o ID da marca dos parâmetros da requisição", async () => {
    const specificBrandId = "specific-brand-id";
    mockRequest.params = { id: specificBrandId };

    await deleteBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockDeleteBrandUseCase.execute).toHaveBeenCalledWith(
      specificBrandId,
      "user-id"
    );
  });
});
