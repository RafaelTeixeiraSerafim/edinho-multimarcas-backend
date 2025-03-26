import "reflect-metadata";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { UnauthorizedError } from "@shared/infra/http/errors";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import auth from "@config/auth";

// Mock the dependencies
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("@modules/users/repositories/IUserRepository");

describe("AuthenticateUserUseCase", () => {
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
  const mockJwt = { sign } as jest.Mocked<{ sign: typeof sign }>;

  // Mock environment variables
  const originalEnv = process.env;

  const mockNow = Date.now();

  beforeEach(() => {
    jest.clearAllMocks();

    process.env = {
      ...originalEnv,
      AUTH_TOKEN_SECRET: "test-secret",
      AUTH_REFRESH_TOKEN_SECRET: "test-refresh-secret",
    };

    mockUserRepository = {
      findByEmail: jest.fn(),
      refreshToken: jest.fn(),
      // Add other methods if needed
    } as any;

    authenticateUserUseCase = new AuthenticateUserUseCase(mockUserRepository);

    jest.spyOn(Date, "now").mockImplementation(() => mockNow)
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // Helper to create mock user
  const createMockUser = (overrides: any = {}) => ({
    id: "user-id",
    name: "Test User",
    email: "test@example.com",
    password: "hashedPassword123",
    refreshToken: "oldRefreshToken",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    ...overrides,
  });

  it("deve autenticar um usuário com sucesso", async () => {
    const mockUser = createMockUser();
    const authData = {
      email: "test@example.com",
      password: "correctPassword",
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(true as never);
    mockJwt.sign.mockImplementation((payload, secret) => {
      if (secret === "test-secret") return "mocked-access-token";
      return "mocked-refresh-token";
    });
    mockUserRepository.refreshToken.mockResolvedValue({
      ...mockUser,
      refreshToken: "mocked-refresh-token",
    });

    const result = await authenticateUserUseCase.execute(authData);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(authData.email);
    expect(mockBcrypt.compare).toHaveBeenCalledWith(
      authData.password,
      mockUser.password
    );
    expect(mockJwt.sign).toHaveBeenCalledTimes(2);
    expect(mockUserRepository.refreshToken).toHaveBeenCalledWith(
      mockUser.id,
      "mocked-refresh-token",
      mockUser.id
    );
    expect(result).toEqual({
      accessToken: "mocked-access-token",
      refreshToken: "mocked-refresh-token",
      tokenExpiry: mockNow + auth.accessTokenExpiresInMinutes * 60 * 1000,
      user: {
        ...mockUser,
        refreshToken: "mocked-refresh-token",
      },
    });
  });

  it("deve lançar erro quando email não existe", async () => {
    const authData = {
      email: "nonexistent@example.com",
      password: "anyPassword",
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(authenticateUserUseCase.execute(authData)).rejects.toThrow(
      UnauthorizedError
    );
  });

  it("deve lançar erro quando senha está incorreta", async () => {
    const mockUser = createMockUser();
    const authData = {
      email: "test@example.com",
      password: "wrongPassword",
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(false as never);

    await expect(authenticateUserUseCase.execute(authData)).rejects.toThrow(
      UnauthorizedError
    );
  });

  it("deve lançar erro quando variáveis de ambiente estão ausentes", async () => {
    process.env.AUTH_TOKEN_SECRET = undefined;
    process.env.AUTH_REFRESH_TOKEN_SECRET = undefined;

    const mockUser = createMockUser();
    const authData = {
      email: "test@example.com",
      password: "correctPassword",
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(true as never);

    await expect(authenticateUserUseCase.execute(authData)).rejects.toThrow(
      "Variáveis de ambiente de autenticação ausentes"
    );
  });
});
