import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UnauthorizedError, ValidationError } from "@shared/infra/http/errors";
import { UpdateFuelTypeController } from "@modules/fuelTypes/useCases/updateFuelType/UpdateFuelTypeController";
import { UpdateFuelTypeUseCase } from "@modules/fuelTypes/useCases/updateFuelType/UpdateFuelTypeUseCase";

// Mock do use case
jest.mock("@modules/fuelTypes/useCases/updateFuelType/UpdateFuelTypeUseCase");

describe("UpdateFuelTypeController", () => {
  let updateFuelTypeController: UpdateFuelTypeController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    updateFuelTypeController = new UpdateFuelTypeController();

    mockRequest = {
      params: { id: "fuel-type-id" },
      body: {},
      user: {
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
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("deve atualizar um tipo de combustível com sucesso", async () => {
    const mockData = { name: "Gasolina", abbreviation: "GAS" };
    mockRequest.body = mockData;

    const mockUpdatedFuelType = { id: "fuel-type-id", ...mockData };
    const mockExecute = jest.fn().mockResolvedValue(mockUpdatedFuelType);
    (UpdateFuelTypeUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await updateFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedFuelType);
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await updateFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it("deve retornar erro 400 quando corpo da requisição está vazio", async () => {
    mockRequest.body = {};

    await updateFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Erro de teste");
    mockRequest.body = { name: "Gasolina" };

    const mockExecute = jest.fn().mockRejectedValue(mockError);
    (UpdateFuelTypeUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await updateFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve permitir atualização parcial (apenas nome)", async () => {
    const mockData = { name: "Gasolina" };
    mockRequest.body = mockData;

    const mockUpdatedFuelType = {
      id: "fuel-type-id",
      name: "Gasolina",
      abbreviation: "OLD",
    };
    const mockExecute = jest.fn().mockResolvedValue(mockUpdatedFuelType);
    (UpdateFuelTypeUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await updateFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockExecute).toHaveBeenCalledWith(
      "fuel-type-id",
      mockData,
      "user-id"
    );
  });

  it("deve permitir atualização parcial (apenas abreviação)", async () => {
    const mockData = { abbreviation: "GAS" };
    mockRequest.body = mockData;

    const mockUpdatedFuelType = {
      id: "fuel-type-id",
      name: "OLD",
      abbreviation: "GAS",
    };
    const mockExecute = jest.fn().mockResolvedValue(mockUpdatedFuelType);
    (UpdateFuelTypeUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await updateFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockExecute).toHaveBeenCalledWith(
      "fuel-type-id",
      mockData,
      "user-id"
    );
  });
});
