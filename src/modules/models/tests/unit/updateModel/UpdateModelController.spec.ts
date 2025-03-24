import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UnauthorizedError, ValidationError } from "@shared/infra/http/errors";
import { UpdateModelController } from "@modules/models/useCases/updateModel/UpdateModelController";
import { UpdateModelUseCase } from "@modules/models/useCases/updateModel/UpdateModelUseCase";

// Mock the use case with proper module path
jest.mock("@modules/models/useCases/updateModel/UpdateModelUseCase");

describe("UpdateModelController", () => {
  let updateModelController: UpdateModelController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockUpdateModelUseCase: jest.Mocked<UpdateModelUseCase>;

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

  // Complete mock model with all properties
  const createMockModel = (overrides: any = {}) => ({
    id: "model-id",
    name: "Test Model",
    brandId: "brand-id",
    fipeCode: "123",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    createdById: "creator-id",
    updatedById: null,
    deletedById: null,
    ...overrides
  });

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();

    // Create mock instance
    mockUpdateModelUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock the constructor
    (UpdateModelUseCase as jest.Mock).mockImplementation(() => mockUpdateModelUseCase);

    updateModelController = new UpdateModelController();

    mockRequest = {
      params: { id: "model-id" },
      body: {},
      user: mockUser,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("deve atualizar um modelo com sucesso e retornar status 200", async () => {
    const mockData = { 
      name: "Updated Model",
      brandId: "new-brand-id" 
    };
    mockRequest.body = mockData;

    const mockUpdatedModel = createMockModel(mockData);
    mockUpdateModelUseCase.execute.mockResolvedValue(mockUpdatedModel);

    await updateModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedModel);
    expect(mockUpdateModelUseCase.execute).toHaveBeenCalledWith(
      "model-id",
      mockData,
      "user-id"
    );
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await updateModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockUpdateModelUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 quando corpo da requisição está vazio", async () => {
    mockRequest.body = {};

    await updateModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(mockUpdateModelUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Test error");
    mockRequest.body = { name: "Test Model" };
    mockUpdateModelUseCase.execute.mockRejectedValue(mockError);

    await updateModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve atualizar parcialmente apenas o nome quando fornecido", async () => {
    const mockData = { name: "Updated Model Name" };
    mockRequest.body = mockData;

    const mockUpdatedModel = createMockModel({
      ...mockData,
      brandId: "original-brand-id" // Mantém o brandId original
    });
    mockUpdateModelUseCase.execute.mockResolvedValue(mockUpdatedModel);

    await updateModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      name: "Updated Model Name",
      brandId: "original-brand-id"
    }));
  });

  it("deve atualizar parcialmente apenas o brandId quando fornecido", async () => {
    const mockData = { brandId: "new-brand-id" };
    mockRequest.body = mockData;

    const mockUpdatedModel = createMockModel({
      ...mockData,
      name: "Original Model" // Mantém o nome original
    });
    mockUpdateModelUseCase.execute.mockResolvedValue(mockUpdatedModel);

    await updateModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      name: "Original Model",
      brandId: "new-brand-id"
    }));
  });
});