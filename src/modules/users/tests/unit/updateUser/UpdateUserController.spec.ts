import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UpdateUserController } from "@modules/users/useCases/updateUser/UpdateUserController";
import { UpdateUserUseCase } from "@modules/users/useCases/updateUser/UpdateUserUseCase";
import { UnauthorizedError, ValidationError } from "@shared/infra/http/errors";
import { UserResponseDTO } from "@modules/users/dtos/UserResponseDTO";
import { IUser } from "@modules/users/interfaces/IUser";

// Mock the use case
jest.mock("@modules/users/useCases/updateUser/UpdateUserUseCase");

describe("UpdateUserController", () => {
  let updateUserController: UpdateUserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockUpdateUserUseCase: jest.Mocked<UpdateUserUseCase>;

  const mockUser: IUser = {
    id: "user-id",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "123",
    refreshToken: "refresh-token",
    birthdate: new Date("1990-01-01"),
    contact: "+5511999999999",
    nationalId: "12345678900",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    deletedAt: null,
    createdById: null,
    updatedById: null,
    deletedById: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();

    mockUpdateUserUseCase = {
      execute: jest.fn(),
    } as any;

    (UpdateUserUseCase as jest.Mock).mockImplementation(
      () => mockUpdateUserUseCase
    );

    updateUserController = new UpdateUserController();

    mockRequest = {
      params: { id: "user-id" },
      body: {},
      user: mockUser,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  const createMockUserData = (overrides = {}): Partial<UserResponseDTO> => ({
    name: "Updated User",
    email: "updated@example.com",
    birthdate: new Date("1990-01-01"),
    contact: "+5511888888888",
    nationalId: "98765432100",
    ...overrides,
  });

  const createMockUserResponse = (overrides = {}): UserResponseDTO => {
    const { password, refreshToken, ...mockUserResponse } = mockUser;
    return {
      ...mockUserResponse,
      ...overrides,
      updatedById: "user-id",
    };
  };

  it("deve atualizar um usuário com sucesso e retornar status 200", async () => {
    const mockUserData = createMockUserData();
    const mockUpdatedUser = createMockUserResponse(mockUserData);

    mockRequest.body = mockUserData;
    mockUpdateUserUseCase.execute.mockResolvedValue(mockUpdatedUser);

    await updateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(
      "user-id",
      mockUserData,
      "user-id"
    );
  });

  it("deve retornar erro 401 quando usuário não está autenticado", async () => {
    mockRequest.user = undefined;

    await updateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockUpdateUserUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 quando corpo da requisição está vazio", async () => {
    mockRequest.body = {};

    await updateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(mockUpdateUserUseCase.execute).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Erro de teste");
    mockRequest.body = createMockUserData();
    mockUpdateUserUseCase.execute.mockRejectedValue(mockError);

    await updateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("deve usar o ID do usuário autenticado para a atualização", async () => {
    const specificUserId = "specific-user-id";
    const mockUserData = createMockUserData();
    const mockUpdatedUser = createMockUserResponse({
      ...mockUserData,
      updatedById: specificUserId,
    });

    mockRequest.body = mockUserData;
    mockRequest.user = { ...mockUser, id: specificUserId };
    mockUpdateUserUseCase.execute.mockResolvedValue(mockUpdatedUser);

    await updateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(
      "user-id",
      mockUserData,
      specificUserId
    );
  });

  it("deve validar campos sensíveis como email e CPF", async () => {
    const mockUserData = createMockUserData({
      email: "new@example.com",
      nationalId: "12345678900",
    });

    mockRequest.body = mockUserData;
    mockUpdateUserUseCase.execute.mockResolvedValue(
      createMockUserResponse(mockUserData)
    );

    await updateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(
      "user-id",
      expect.objectContaining({
        email: "new@example.com",
        nationalId: "12345678900",
      }),
      "user-id"
    );
  });

  it("não deve retornar campos sensíveis como password e refreshToken", async () => {
    const mockUserData = createMockUserData();
    const mockUpdatedUser = {
      ...createMockUserResponse(mockUserData),
    };

    mockRequest.body = mockUserData;
    mockUpdateUserUseCase.execute.mockResolvedValue(mockUpdatedUser);

    await updateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(responseData).not.toHaveProperty("password");
    expect(responseData).not.toHaveProperty("refreshToken");
  });

  it("deve incluir informações de relacionamento (createdBy, updatedBy, deletedBy)", async () => {
    const mockUserData = createMockUserData();
    const mockUpdatedUser = {
      ...createMockUserResponse(mockUserData),
      createdBy: { id: "creator-id", name: "Creator" },
      updatedBy: { id: "updater-id", name: "Updater" },
    };

    mockRequest.body = mockUserData;
    mockUpdateUserUseCase.execute.mockResolvedValue(mockUpdatedUser);

    await updateUserController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const responseData = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(responseData).toHaveProperty("createdBy");
    expect(responseData).toHaveProperty("updatedBy");
    expect(responseData.createdBy).toHaveProperty("id", "creator-id");
    expect(responseData.updatedBy).toHaveProperty("name", "Updater");
  });
});
