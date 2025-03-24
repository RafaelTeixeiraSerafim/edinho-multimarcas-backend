import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { CreateUserDTO } from "@modules/users/dtos/CreateUserDTO";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { CreateUserController } from "@modules/users/useCases/createUser/CreateUserController";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

// Mock the use case with proper module path
jest.mock("@modules/users/useCases/createUser/CreateUserUseCase");

describe("CreateUserController", () => {
  let createUserController: CreateUserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockCreateUserUseCase: jest.Mocked<CreateUserUseCase>;

  // Complete user object for request.user
  const mockUser = {
    id: "admin-id",
    name: "Admin User",
    email: "admin@example.com",
    refreshToken: null,
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();

    // Create mock instance
    mockCreateUserUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock the constructor
    (CreateUserUseCase as jest.Mock).mockImplementation(
      () => mockCreateUserUseCase
    );

    createUserController = new CreateUserController();

    mockRequest = {
      body: {},
      user: undefined,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  // Helper to create complete mock user data
  const createMockUserData = (overrides: any = {}) => ({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    birthdate: new Date("1990-01-01"),
    contact: "11999999999",
    nationalId: "12345678901",
    ...overrides,
  });

  // Helper to create mock user response
  const createMockUserResponse = (overrides: any = {}) => ({
    id: "user-id",
    name: "Test User",
    email: "test@example.com",
    birthdate: new Date("1990-01-01"),
    contact: "11999999999",
    nationalId: "12345678901",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    ...overrides,
  });

  it("deve criar um usuário com sucesso (sem createdBy)", async () => {
    const userData = createMockUserData();
    const mockUserResponse = createMockUserResponse();

    mockRequest.body = userData;
    mockCreateUserUseCase.execute.mockResolvedValue(mockUserResponse);

    await createUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUserResponse);
    expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(userData);
  });

  it("deve criar um usuário com sucesso (com createdBy)", async () => {
    const userData = createMockUserData();
    const mockUserResponse = createMockUserResponse();
    mockRequest.body = userData;
    mockRequest.user = mockUser;

    mockCreateUserUseCase.execute.mockResolvedValue(mockUserResponse);

    await createUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(
      userData,
      "admin-id"
    );
  });

  it("deve chamar next com ConflictError quando email já existe", async () => {
    const userData = createMockUserData();
    const mockError = new ConflictError("Email já existe", "email");

    mockRequest.body = userData;
    mockCreateUserUseCase.execute.mockRejectedValue(mockError);

    await createUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("deve criar usuário com campos opcionais ausentes", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };
    const mockUserResponse = createMockUserResponse({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    mockRequest.body = userData;
    mockCreateUserUseCase.execute.mockImplementation(async (data) => {
      // Verify the received data doesn't have optional fields
      expect(data).toEqual({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      return mockUserResponse;
    });

    await createUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUserResponse);
  });

  it("deve criar usuário com campos opcionais preenchidos", async () => {
    const userData = createMockUserData();
    const mockUserResponse = createMockUserResponse();

    mockRequest.body = userData;
    mockCreateUserUseCase.execute.mockResolvedValue(mockUserResponse);

    await createUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        birthdate: expect.any(Date),
        contact: expect.any(String),
        nationalId: expect.any(String),
      })
    );
  });

  it("deve chamar next com erro genérico quando ocorrer", async () => {
    const userData = createMockUserData();
    const mockError = new Error("Erro inesperado");

    mockRequest.body = userData;
    mockCreateUserUseCase.execute.mockRejectedValue(mockError);

    await createUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
