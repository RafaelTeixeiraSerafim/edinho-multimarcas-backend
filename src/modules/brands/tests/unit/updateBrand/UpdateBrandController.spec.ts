import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UnauthorizedError, BadRequestError } from "@shared/infra/http/errors";
import { UpdateBrandController } from "@modules/brands/useCases/updateBrand/UpdateBrandController";
import { UpdateBrandUseCase } from "@modules/brands/useCases/updateBrand/UpdateBrandUseCase";

// Mock the use case with proper module path
jest.mock("@modules/brands/useCases/updateBrand/UpdateBrandUseCase");

describe("UpdateBrandController", () => {
  let updateBrandController: UpdateBrandController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockUpdateBrandUseCase: jest.Mocked<UpdateBrandUseCase>;

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
    mockUpdateBrandUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock the constructor
    (UpdateBrandUseCase as jest.Mock).mockImplementation(
      () => mockUpdateBrandUseCase
    );

    updateBrandController = new UpdateBrandController();

    mockRequest = {
      params: { id: "brand-id" },
      body: {},
      user: mockUser,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  const createMockBrand = (overrides = {}) => ({
    id: "brand-id",
    name: "Original Brand",
    isDeleted: false,
    fipeCode: "123",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    createdById: "user-id",
    updatedById: null,
    deletedById: null,
    ...overrides,
  });

  it("deve atualizar uma marca com sucesso e retornar status 200", async () => {
    const mockBrandData = createMockBrand();
    const mockUpdatedBrand = {
      ...mockBrandData,
      updatedById: "user-id",
    };

    mockRequest.body = mockBrandData;
    mockUpdateBrandUseCase.execute.mockResolvedValue(mockUpdatedBrand);

    await updateBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedBrand);
    expect(mockUpdateBrandUseCase.execute).toHaveBeenCalledWith(
      "brand-id",
      mockBrandData,
      "user-id"
    );
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await updateBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockUpdateBrandUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 quando corpo da requisição está vazio", async () => {
    mockRequest.body = {};

    await updateBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    expect(mockUpdateBrandUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Test error");
    mockRequest.body = { name: "Test Brand" };
    mockUpdateBrandUseCase.execute.mockRejectedValue(mockError);

    await updateBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve usar o ID do usuário autenticado para a atualização", async () => {
    const specificUserId = "specific-user-id";
    const mockBrandData = createMockBrand();
    const mockUpdatedBrand = {
      ...mockBrandData,
      updatedById: specificUserId,
    };

    mockRequest.body = mockBrandData;
    mockRequest.user = { ...mockUser, id: specificUserId };
    mockUpdateBrandUseCase.execute.mockResolvedValue(mockUpdatedBrand);

    await updateBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockUpdateBrandUseCase.execute).toHaveBeenCalledWith(
      "brand-id",
      mockBrandData,
      specificUserId
    );
  });
});
