import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { DeleteVehicleController } from "@modules/vehicles/useCases/deleteVehicle/DeleteVehicleController";
import { DeleteVehicleUseCase } from "@modules/vehicles/useCases/deleteVehicle/DeleteVehicleUseCase";
import { UnauthorizedError } from "@shared/infra/http/errors";

// Mock the use case
jest.mock("@modules/vehicles/useCases/deleteVehicle/DeleteVehicleUseCase");

describe("DeleteVehicleController", () => {
  let deleteVehicleController: DeleteVehicleController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockDeleteVehicleUseCase: jest.Mocked<DeleteVehicleUseCase>;

  const mockUser = {
    id: "user-id",
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();

    mockDeleteVehicleUseCase = {
      execute: jest.fn(),
    } as any;

    (DeleteVehicleUseCase as jest.Mock).mockImplementation(
      () => mockDeleteVehicleUseCase
    );

    deleteVehicleController = new DeleteVehicleController();

    mockRequest = {
      params: { id: "vehicle-id" },
      user: mockUser,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("deve deletar um veículo com sucesso e retornar status 204", async () => {
    await deleteVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockDeleteVehicleUseCase.execute).toHaveBeenCalledWith(
      "vehicle-id",
      "user-id"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.json).toHaveBeenCalledWith({});
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await deleteVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockDeleteVehicleUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Erro de teste");
    mockDeleteVehicleUseCase.execute.mockRejectedValue(mockError);

    await deleteVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve usar o ID do usuário autenticado para a deleção", async () => {
    const specificUserId = "specific-user-id";
    mockRequest.user = { ...mockUser, id: specificUserId };

    await deleteVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockDeleteVehicleUseCase.execute).toHaveBeenCalledWith(
      "vehicle-id",
      specificUserId
    );
  });

  it("deve usar o ID do veículo dos parâmetros da requisição", async () => {
    const specificVehicleId = "specific-vehicle-id";
    mockRequest.params = { id: specificVehicleId };

    await deleteVehicleController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockDeleteVehicleUseCase.execute).toHaveBeenCalledWith(
      specificVehicleId,
      "user-id"
    );
  });
});
