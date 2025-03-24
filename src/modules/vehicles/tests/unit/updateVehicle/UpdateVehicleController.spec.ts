import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UpdateVehicleController } from "@modules/vehicles/useCases/updateVehicle/UpdateVehicleController";
import { UpdateVehicleUseCase } from "@modules/vehicles/useCases/updateVehicle/UpdateVehicleUseCase";
import { UpdateVehicleDTO } from "@modules/vehicles/dtos/UpdateVehicleDTO";
import { UnauthorizedError, ValidationError } from "@shared/infra/http/errors";

// Mock the use case
jest.mock("@modules/vehicles/useCases/updateVehicle/UpdateVehicleUseCase");

describe("UpdateVehicleController", () => {
  let updateVehicleController: UpdateVehicleController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockUpdateVehicleUseCase: jest.Mocked<UpdateVehicleUseCase>;

  // Helper functions
  const createMockVehicleDTO = (
    overrides: Partial<UpdateVehicleDTO> = {}
  ): UpdateVehicleDTO => ({
    value: 50000,
    vehicleYear: 2023,
    modelId: "model-id-123",
    fuelTypeId: "fuel-type-id-123",
    ...overrides,
  });

  const createMockUser = () => ({
    id: "user-id-123",
    name: "Test User",
    email: "test@example.com",
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

    mockUpdateVehicleUseCase = {
      execute: jest.fn(),
    } as any;

    (UpdateVehicleUseCase as jest.Mock).mockImplementation(
      () => mockUpdateVehicleUseCase
    );

    updateVehicleController = new UpdateVehicleController();

    mockRequest = {
      params: { id: "vehicle-id-123" },
      body: createMockVehicleDTO(),
      user: createMockUser(),
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("deve atualizar veículo com sucesso e retornar status 200", async () => {
    const mockUpdatedVehicle = {
      id: "vehicle-id-123",
      value: 55000,
      vehicleYear: 2023,
      fipeCode: null,
      referenceMonth: 6,
      referenceYear: 2023,
      modelId: "model-id",
      fuelTypeId: "fuel-type-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isDeleted: false,
      createdById: "user-id",
      updatedById: null,
      deletedById: null,
    };

    mockUpdateVehicleUseCase.execute.mockResolvedValue(mockUpdatedVehicle);

    await updateVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockUpdateVehicleUseCase.execute).toHaveBeenCalledWith(
      "vehicle-id-123",
      expect.any(Object),
      "user-id-123"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedVehicle);
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await updateVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockUpdateVehicleUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 quando corpo da requisição está vazio", async () => {
    mockRequest.body = {};

    await updateVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(mockUpdateVehicleUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Test Error");
    mockUpdateVehicleUseCase.execute.mockRejectedValue(mockError);

    await updateVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve usar o ID do veículo dos parâmetros", async () => {
    const specificVehicleId = "specific-vehicle-id";
    mockRequest.params = { id: specificVehicleId };

    await updateVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockUpdateVehicleUseCase.execute).toHaveBeenCalledWith(
      specificVehicleId,
      expect.any(Object),
      "user-id-123"
    );
  });

  it("deve usar o ID do usuário autenticado", async () => {
    const specificUserId = "specific-user-id";
    mockRequest.user = { ...createMockUser(), id: specificUserId };

    await updateVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockUpdateVehicleUseCase.execute).toHaveBeenCalledWith(
      "vehicle-id-123",
      expect.any(Object),
      specificUserId
    );
  });
});
