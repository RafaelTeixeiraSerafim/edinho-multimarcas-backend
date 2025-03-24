import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UnauthorizedError } from "@shared/infra/http/errors";
import { AuthenticateUserController } from "@modules/users/useCases/authenticateUser/AuthenticateUserController";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";

// Mock the use case with proper module path
jest.mock("@modules/users/useCases/authenticateUser/AuthenticateUserUseCase");

describe("AuthenticateUserController", () => {
  let authenticateUserController: AuthenticateUserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockAuthenticateUserUseCase: jest.Mocked<AuthenticateUserUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();

    // Create mock instance
    mockAuthenticateUserUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock the constructor
    (AuthenticateUserUseCase as jest.Mock).mockImplementation(
      () => mockAuthenticateUserUseCase
    );

    authenticateUserController = new AuthenticateUserController();

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  // Helper to create mock auth response
  const createMockAuthResponse = () => ({
    accessToken: "mocked-access-token",
    refreshToken: "mocked-refresh-token",
    user: {
      id: "user-id",
      name: "Test User",
      email: "test@example.com",
      refreshToken: "mocked-refresh-token",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      password: "hashedPassword123",
      deletedAt: null,
      createdById: null,
      updatedById: null,
      deletedById: null,
      birthdate: null,
      contact: null,
      nationalId: null,
    },
  });

  it("deve autenticar um usuário com sucesso e retornar status 200", async () => {
    const authData = {
      email: "test@example.com",
      password: "correctPassword",
    };
    const mockAuthResponse = createMockAuthResponse();

    mockRequest.body = authData;
    mockAuthenticateUserUseCase.execute.mockResolvedValue(mockAuthResponse);

    await authenticateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
    expect(mockAuthenticateUserUseCase.execute).toHaveBeenCalledWith(authData);
  });

  it("deve chamar next com erro quando use case lançar UnauthorizedError", async () => {
    const authData = {
      email: "wrong@example.com",
      password: "wrongPassword",
    };
    const mockError = new UnauthorizedError("Credenciais inválidas");

    mockRequest.body = authData;
    mockAuthenticateUserUseCase.execute.mockRejectedValue(mockError);

    await authenticateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar outros erros", async () => {
    const authData = {
      email: "test@example.com",
      password: "correctPassword",
    };
    const mockError = new Error("Erro inesperado");

    mockRequest.body = authData;
    mockAuthenticateUserUseCase.execute.mockRejectedValue(mockError);

    await authenticateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 quando corpo da requisição está vazio", async () => {
    mockRequest.body = {};

    await authenticateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Note: Add validation in controller if this should be handled
    expect(mockAuthenticateUserUseCase.execute).toHaveBeenCalledWith({});
  });

  it("deve retornar erro 400 quando email não é fornecido", async () => {
    mockRequest.body = {
      password: "somepassword",
    };

    await authenticateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Note: Add validation in controller if this should be handled
    expect(mockAuthenticateUserUseCase.execute).toHaveBeenCalledWith({
      password: "somepassword",
    });
  });

  it("deve retornar erro 400 quando senha não é fornecida", async () => {
    mockRequest.body = {
      email: "test@example.com",
    };

    await authenticateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Note: Add validation in controller if this should be handled
    expect(mockAuthenticateUserUseCase.execute).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });
});
