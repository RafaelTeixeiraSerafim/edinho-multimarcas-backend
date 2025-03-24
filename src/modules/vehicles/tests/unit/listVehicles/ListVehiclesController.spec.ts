import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ListVehiclesController } from "@modules/vehicles/useCases/listVehicles/ListVehiclesController";
import { ListVehiclesUseCase } from "@modules/vehicles/useCases/listVehicles/ListVehiclesUseCase";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
import { IVehicle } from "@modules/vehicles/interfaces/IVehicle";

// Mock the use case
jest.mock("@modules/vehicles/useCases/listVehicles/ListVehiclesUseCase");

describe("ListVehiclesController", () => {
  let listVehiclesController: ListVehiclesController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockListVehiclesUseCase: jest.Mocked<ListVehiclesUseCase>;

  // Helper function to create mock vehicles
  const createMockVehicles = (count: number): IVehicle[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `vehicle-${i + 1}`,
      fipeCode: `code-${i + 1}`,
      value: 50000 + (i * 10000),
      modelId: `model-${i + 1}`,
      fuelTypeId: `fuel-${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "user-id",
      deletedAt: null,
      deletedById: null,
      isDeleted: false,
      referenceMonth: new Date().getMonth() + 1,
      referenceYear: new Date().getFullYear(),
      updatedById: null,
      vehicleYear: 2000 + i
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();

    mockListVehiclesUseCase = {
      execute: jest.fn(),
    } as any;

    (ListVehiclesUseCase as jest.Mock).mockImplementation(() => mockListVehiclesUseCase);

    listVehiclesController = new ListVehiclesController();

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

  it("deve listar veículos com sucesso e retornar status 200", async () => {
    const mockVehicles = createMockVehicles(3);
    mockListVehiclesUseCase.execute.mockResolvedValue(mockVehicles);

    await listVehiclesController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockListVehiclesUseCase.execute).toHaveBeenCalledWith(1, 10);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ vehicles: mockVehicles });
  });

  it("deve usar valores padrão quando query params não são fornecidos", async () => {
    mockRequest.query = {};
    const mockVehicles = createMockVehicles(2);
    mockListVehiclesUseCase.execute.mockResolvedValue(mockVehicles);

    await listVehiclesController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockListVehiclesUseCase.execute).toHaveBeenCalledWith(1, 10);
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Erro de teste");
    mockListVehiclesUseCase.execute.mockRejectedValue(mockError);

    await listVehiclesController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve retornar veículos no formato correto", async () => {
    const mockVehicles = createMockVehicles(1);
    mockListVehiclesUseCase.execute.mockResolvedValue(mockVehicles);

    await listVehiclesController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(responseData.vehicles[0]).toHaveProperty("id");
    expect(responseData.vehicles[0]).toHaveProperty("value");
    expect(responseData.vehicles[0]).toHaveProperty("modelId");
    expect(responseData.vehicles[0]).not.toHaveProperty("password");
  });
});