import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UnauthorizedError } from "@shared/infra/http/errors";
import { CreateModelController } from "@modules/models/useCases/createModel/CreateModelController";
import { CreateModelUseCase } from "@modules/models/useCases/createModel/CreateModelUseCase";

// Mock the use case with proper module path
jest.mock("@modules/models/useCases/createModel/CreateModelUseCase");

describe("CreateModelController", () => {
  let createModelController: CreateModelController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockCreateModelUseCase: jest.Mocked<CreateModelUseCase>;

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
    mockCreateModelUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock the constructor
    (CreateModelUseCase as jest.Mock).mockImplementation(() => mockCreateModelUseCase);

    createModelController = new CreateModelController();

    mockRequest = {
      body: {},
      user: mockUser,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  // Helper to create mock model
  const createMockModel = (overrides: any = {}) => ({
    id: "model-id",
    name: "Test Model",
    fipeCode: "123",
    brandId: "brand-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    ...overrides,
  });

  it("deve criar um modelo com sucesso e retornar status 201", async () => {
    const mockData = {
      name: "New Model",
      fipeCode: "1234",
      brandId: "brand-id",
    };
    mockRequest.body = mockData;

    const mockCreatedModel = createMockModel(mockData);
    mockCreateModelUseCase.execute.mockResolvedValue(mockCreatedModel);

    await createModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedModel);
    expect(mockCreateModelUseCase.execute).toHaveBeenCalledWith(
      mockData,
      "user-id"
    );
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await createModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockCreateModelUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Test error");
    mockRequest.body = {
      name: "Test Model",
      brandId: "brand-id",
    };
    mockCreateModelUseCase.execute.mockRejectedValue(mockError);

    await createModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve criar modelo mesmo sem código fipe", async () => {
    const mockData = {
      name: "Model Without Fipe",
      brandId: "brand-id",
    };
    mockRequest.body = mockData;

    const mockCreatedModel = createMockModel({
      ...mockData,
      fipeCode: undefined
    });
    mockCreateModelUseCase.execute.mockResolvedValue(mockCreatedModel);

    await createModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      name: "Model Without Fipe",
      fipeCode: undefined
    }));
  });

  it("deve incluir createdBy no registro criado", async () => {
    const specificUserId = "specific-user-id";
    const mockData = {
      name: "Model with Creator",
      brandId: "brand-id",
    };
    mockRequest.body = mockData;
    mockRequest.user = { ...mockUser, id: specificUserId };

    const mockCreatedModel = createMockModel({
      ...mockData,
      createdById: specificUserId
    });
    mockCreateModelUseCase.execute.mockResolvedValue(mockCreatedModel);

    await createModelController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockCreateModelUseCase.execute).toHaveBeenCalledWith(
      mockData,
      specificUserId
    );
  });
});