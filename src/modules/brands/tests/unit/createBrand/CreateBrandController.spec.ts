import "reflect-metadata"
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UnauthorizedError } from "@shared/infra/http/errors";
import { CreateBrandController } from "@modules/brands/useCases/createBrand/CreateBrandController";
import { CreateBrandUseCase } from "@modules/brands/useCases/createBrand/CreateBrandUseCase";

// Mock do use case
jest.mock("@modules/brands/useCases/createBrand/createBrandUseCase");

describe("CreateBrandController", () => {
  let createBrandController: CreateBrandController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    createBrandController = new CreateBrandController();

    mockRequest = {
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

  it("deve criar uma marca com sucesso e retornar status 201", async () => {
    const mockBrandData = {
      name: "Nova Marca",
      fipeCode: "1234",
    };
    mockRequest.body = mockBrandData;

    const mockCreatedBrand = {
      id: "marca-id",
      ...mockBrandData,
      createdById: "user-id",
    };

    const mockExecute = jest.fn().mockResolvedValue(mockCreatedBrand);
    (CreateBrandUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await createBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedBrand);
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await createBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Erro de teste");
    mockRequest.body = { name: "Marca Teste" };

    const mockExecute = jest.fn().mockRejectedValue(mockError);
    (CreateBrandUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await createBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve criar marca mesmo sem código fipe", async () => {
    const mockBrandData = { name: "Marca sem Fipe" };
    mockRequest.body = mockBrandData;

    const mockCreatedBrand = {
      id: "marca-id",
      ...mockBrandData,
      fipeCode: undefined,
      createdById: "user-id",
    };

    const mockExecute = jest.fn().mockResolvedValue(mockCreatedBrand);
    (CreateBrandUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await createBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockExecute).toHaveBeenCalledWith(mockBrandData, "user-id");
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Marca sem Fipe",
        fipeCode: undefined,
      })
    );
  });

  it("deve garantir que o createdById veio do usuário autenticado", async () => {
    const mockBrandData = { name: "Marca com Criador" };
    mockRequest.body = mockBrandData;
    mockRequest.user = {
      id: "user-req",
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

    const mockCreatedBrand = {
      id: "marca-id",
      ...mockBrandData,
      createdById: "user-req",
    };

    const mockExecute = jest.fn().mockResolvedValue(mockCreatedBrand);
    (CreateBrandUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await createBrandController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockExecute).toHaveBeenCalledWith(mockBrandData, "user-req");
  });
});
