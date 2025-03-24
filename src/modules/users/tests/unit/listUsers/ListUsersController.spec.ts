import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ListUsersController } from "@modules/users/useCases/listUsers/ListUsersController";
import { ListUsersUseCase } from "@modules/users/useCases/listUsers/ListUsersUseCase";
import { UserResponseDTO } from "@modules/users/dtos/UserResponseDTO";

// Mock the use case
jest.mock("@modules/users/useCases/listUsers/ListUsersUseCase");

describe("ListUsersController", () => {
  let listUsersController: ListUsersController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();
    listUsersController = new ListUsersController();

    mockRequest = {
      query: {
        page: "1",
        pageSize: "10",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  const createMockUsers = (count: number): UserResponseDTO[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      deletedAt: null,
      createdById: null,
      updatedById: null,
      deletedById: null,
      birthdate: null,
      contact: null,
      nationalId: null,
    }));
  };

  it("deve listar usuários com sucesso e retornar status 200", async () => {
    const mockUsers: UserResponseDTO[] = createMockUsers(2)

    const mockExecute = jest.fn().mockResolvedValue(mockUsers);
    (ListUsersUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await listUsersController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ users: mockUsers });
  });

  it("deve usar valores padrão quando query params não são fornecidos", async () => {
    mockRequest.query = {};
    const mockUsers: UserResponseDTO[] = createMockUsers(1)

    const mockExecute = jest.fn().mockResolvedValue(mockUsers);
    (ListUsersUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await listUsersController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockExecute).toHaveBeenCalledWith(1, 10);
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Erro de teste");
    const mockExecute = jest.fn().mockRejectedValue(mockError);
    (ListUsersUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await listUsersController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve retornar usuários no formato UserResponseDTO", async () => {
    const mockUsers: UserResponseDTO[] = createMockUsers(1)

    const mockExecute = jest.fn().mockResolvedValue(mockUsers);
    (ListUsersUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await listUsersController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(responseData.users[0]).toHaveProperty("id");
    expect(responseData.users[0]).toHaveProperty("name");
    expect(responseData.users[0]).toHaveProperty("email");
    expect(responseData.users[0]).not.toHaveProperty("password");
  });
});