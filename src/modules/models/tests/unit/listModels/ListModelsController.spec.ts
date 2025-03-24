import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ListModelsController } from "@modules/models/useCases/listModels/ListModelsController";
import { ListModelsUseCase } from "@modules/models/useCases/listModels/ListModelsUseCase";

// Mock the use case with proper module path
jest.mock("@modules/models/useCases/listModels/ListModelsUseCase");

describe("ListModelsController", () => {
  let listModelsController: ListModelsController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockListModelsUseCase: jest.Mocked<ListModelsUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();

    // Create mock instance
    mockListModelsUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock the constructor
    (ListModelsUseCase as jest.Mock).mockImplementation(
      () => mockListModelsUseCase
    );

    listModelsController = new ListModelsController();

    mockRequest = {
      query: {
        page: 1,
        pageSize: 10,
      } as any,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  const createMockModels = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `model-${i + 1}`,
      name: `Model ${i + 1}`,
      fipeCode: `code-${i + 1}`,
      brandId: `brand-${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      deletedAt: null,
      createdById: "user-id",
      updatedById: null,
      deletedById: null,
    }));
  };

  it("deve listar modelos com sucesso e retornar status 200", async () => {
    const mockModels = createMockModels(2)

    mockListModelsUseCase.execute.mockResolvedValue(mockModels);

    await listModelsController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ models: mockModels });
    expect(mockListModelsUseCase.execute).toHaveBeenCalledWith(1, 10);
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Test error");
    mockListModelsUseCase.execute.mockRejectedValue(mockError);

    await listModelsController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve passar os parâmetros de paginação corretamente para o use case", async () => {
    const mockModels = createMockModels(1)
    const testPage = 2;
    const testPageSize = 5;

    mockRequest.query = {
      page: testPage,
      pageSize: testPageSize,
    } as any;

    mockListModelsUseCase.execute.mockResolvedValue(mockModels);

    await listModelsController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockListModelsUseCase.execute).toHaveBeenCalledWith(
      testPage,
      testPageSize
    );
  });

  it("should use default pagination when no query params", async () => {
    const mockData = createMockModels(2)
    mockListModelsUseCase.execute.mockResolvedValue(mockData);
    mockRequest = { query: {} }; // Empty query

    await listModelsController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockListModelsUseCase.execute).toHaveBeenCalledWith(1, 10); // Default values
  });
});
