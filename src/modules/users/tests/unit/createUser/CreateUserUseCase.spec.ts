import "reflect-metadata";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { generateHashedPassword } from "@utils/generateHashedPassword";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

// Mock the dependencies
jest.mock("@utils/generateHashedPassword");
jest.mock("@modules/users/repositories/IUserRepository");

describe("CreateUserUseCase", () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  const mockGenerateHashedPassword = generateHashedPassword as jest.MockedFunction<typeof generateHashedPassword>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = {
      findByEmail: jest.fn(),
      findByNationalId: jest.fn(),
      create: jest.fn(),
      // Add other methods if needed
    } as any;

    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  // Helper to create mock user data
  const createMockUserData = (overrides: any = {}) => ({
    name: "Test User",
    email: "test@example.com",
    password: "plainPassword123",
    nationalId: "12345678901",
    ...overrides
  });

  // Helper to create mock user response
  const createMockUserResponse = (overrides: any = {}) => ({
    id: "user-id",
    name: "Test User",
    email: "test@example.com",
    nationalId: "12345678901",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    ...overrides
  });

  it("deve criar um usuário com sucesso", async () => {
    const userData = createMockUserData();
    const plainPassword = userData.password
    const hashedPassword = "hashedPassword123";
    const mockUserResponse = createMockUserResponse();

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByNationalId.mockResolvedValue(null);
    mockGenerateHashedPassword.mockResolvedValue(hashedPassword);
    mockUserRepository.create.mockResolvedValue(mockUserResponse);

    const result = await createUserUseCase.execute(userData);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(mockUserRepository.findByNationalId).toHaveBeenCalledWith(userData.nationalId);
    expect(mockGenerateHashedPassword).toHaveBeenCalledWith(plainPassword);
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      { ...userData, password: hashedPassword },
      undefined
    );
    expect(result).toEqual(mockUserResponse);
  });

  it("deve criar usuário com createdById quando fornecido", async () => {
    const userData = createMockUserData();
    const hashedPassword = "hashedPassword123";
    const mockUserResponse = createMockUserResponse();
    const createdById = "admin-user-id";

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByNationalId.mockResolvedValue(null);
    mockGenerateHashedPassword.mockResolvedValue(hashedPassword);
    mockUserRepository.create.mockResolvedValue(mockUserResponse);

    const result = await createUserUseCase.execute(userData, createdById);

    expect(mockUserRepository.create).toHaveBeenCalledWith(
      { ...userData, password: hashedPassword },
      createdById
    );
  });

  it("deve lançar erro quando email já existe", async () => {
    const userData = createMockUserData();
    const existingUser = createMockUserResponse();

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(
      createUserUseCase.execute(userData)
    ).rejects.toThrow(ConflictError);
  });

  it("deve lançar erro quando CPF já existe", async () => {
    const userData = createMockUserData();
    const existingUser = createMockUserResponse();

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByNationalId.mockResolvedValue(existingUser);

    await expect(
      createUserUseCase.execute(userData)
    ).rejects.toThrow(ConflictError);
  });

  it("deve criar usuário sem CPF quando não fornecido", async () => {
    const userData = createMockUserData({ nationalId: undefined });
    const hashedPassword = "hashedPassword123";
    const mockUserResponse = createMockUserResponse({ nationalId: undefined });

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockGenerateHashedPassword.mockResolvedValue(hashedPassword);
    mockUserRepository.create.mockResolvedValue(mockUserResponse);

    const result = await createUserUseCase.execute(userData);

    expect(mockUserRepository.findByNationalId).not.toHaveBeenCalled();
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ nationalId: undefined }),
      undefined
    );
  });

  it("deve garantir que a senha é hasheada antes de criar", async () => {
    const userData = createMockUserData();
    const hashedPassword = "hashedPassword123";
    const mockUserResponse = createMockUserResponse();

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByNationalId.mockResolvedValue(null);
    mockGenerateHashedPassword.mockResolvedValue(hashedPassword);
    mockUserRepository.create.mockResolvedValue(mockUserResponse);

    await createUserUseCase.execute(userData);

    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: hashedPassword }),
      undefined
    );
  });
});