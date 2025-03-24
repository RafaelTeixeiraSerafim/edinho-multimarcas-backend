import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { CreateVehicleController } from "@modules/vehicles/useCases/createVehicle/CreateVehicleController";
import { CreateVehicleUseCase } from "@modules/vehicles/useCases/createVehicle/CreateVehicleUseCase";
import { CreateVehicleDTO } from "@modules/vehicles/dtos/CreateVehicleDTO";
import { UnauthorizedError } from "@shared/infra/http/errors";

// Mock the use case
jest.mock("@modules/vehicles/useCases/createVehicle/CreateVehicleUseCase");

describe("CreateVehicleController", () => {
  let createVehicleController: CreateVehicleController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockCreateVehicleUseCase: jest.Mocked<CreateVehicleUseCase>;

  // Helper functions
  const createMockVehicleDTO = (
    overrides: Partial<CreateVehicleDTO> = {}
  ): CreateVehicleDTO => ({
    fipeCode: "123456",
    value: 50000,
    referenceMonth: new Date().getMonth() + 1,
    referenceYear: new Date().getFullYear(),
    vehicleYear: 2023,
    modelId: "modelo-id",
    fuelTypeId: "combustivel-id",
    ...overrides,
  });

  const createMockVehicle = (overrides: any = {}) => ({
    id: "veiculo-id",
    fipeCode: "123456",
    value: 50000,
    referenceMonth: 6,
    referenceYear: 2023,
    vehicleYear: 2023,
    modelId: "modelo-id",
    fuelTypeId: "combustivel-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: false,
    createdById: "usuario-id",
    updatedById: null,
    deletedById: null,
    ...overrides,
  });

  const createMockUser = () => ({
    id: "usuario-id",
    name: "John Doe",
    email: "john.doe@example.com",
    isDeleted: false,
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: "hashedPassword123",
    deletedAt: null,
    createdById: null,
    updatedById: null,
    deletedById: null,
    birthdate: null,
    contact: null,
    nationalId: null,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();

    mockCreateVehicleUseCase = {
      execute: jest.fn(),
    } as any;

    (CreateVehicleUseCase as jest.Mock).mockImplementation(
      () => mockCreateVehicleUseCase
    );

    createVehicleController = new CreateVehicleController();

    mockRequest = {
      body: createMockVehicleDTO(),
      user: createMockUser(),
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("deve criar um veículo com sucesso e retornar status 201", async () => {
    const mockVehicle = createMockVehicle();
    mockCreateVehicleUseCase.execute.mockResolvedValue(mockVehicle);

    await createVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockVehicle);
    expect(mockCreateVehicleUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        modelId: "modelo-id",
        fuelTypeId: "combustivel-id",
      }),
      "usuario-id"
    );
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await createVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockCreateVehicleUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve definir mês e ano de referência padrão quando não fornecidos", async () => {
    const currentDate = new Date();
    const mockData = createMockVehicleDTO({
      referenceMonth: undefined,
      referenceYear: undefined,
    });
    mockRequest.body = mockData;

    const mockVehicle = createMockVehicle({
      referenceMonth: currentDate.getMonth() + 1,
      referenceYear: currentDate.getFullYear(),
    });
    mockCreateVehicleUseCase.execute.mockResolvedValue(mockVehicle);

    await createVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockCreateVehicleUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceMonth: currentDate.getMonth() + 1,
        referenceYear: currentDate.getFullYear(),
      }),
      "usuario-id"
    );
  });

  it("deve usar mês e ano de referência fornecidos", async () => {
    const mockData = createMockVehicleDTO({
      referenceMonth: 5,
      referenceYear: 2022,
    });
    mockRequest.body = mockData;

    const mockVehicle = createMockVehicle({
      referenceMonth: 5,
      referenceYear: 2022,
    });
    mockCreateVehicleUseCase.execute.mockResolvedValue(mockVehicle);

    await createVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockCreateVehicleUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceMonth: 5,
        referenceYear: 2022,
      }),
      "usuario-id"
    );
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Erro de teste");
    mockCreateVehicleUseCase.execute.mockRejectedValue(mockError);

    await createVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve incluir createdBy no registro criado", async () => {
    const specificUserId = "usuario-especifico";
    mockRequest.user = { ...createMockUser(), id: specificUserId };
    const mockVehicle = createMockVehicle({ createdById: specificUserId });
    mockCreateVehicleUseCase.execute.mockResolvedValue(mockVehicle);

    await createVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockCreateVehicleUseCase.execute).toHaveBeenCalledWith(
      expect.anything(),
      specificUserId
    );
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        createdById: specificUserId,
      })
    );
  });
});
