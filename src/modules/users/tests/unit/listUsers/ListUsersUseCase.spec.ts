import "reflect-metadata";
import { ListUsersUseCase } from "@modules/users/useCases/listUsers/ListUsersUseCase";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { UserResponseDTO } from "@modules/users/dtos/UserResponseDTO";

describe("ListUsersUseCase", () => {
  let listUsersUseCase: ListUsersUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = {
      list: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByNationalId: jest.fn(),
      refreshToken: jest.fn(),
    };

    listUsersUseCase = new ListUsersUseCase(mockUserRepository);
  });

  // Helper para criar mock de usuários
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

  it("deve listar usuários com paginação correta", async () => {
    const mockUsers = createMockUsers(5);
    mockUserRepository.list.mockResolvedValue(mockUsers);

    const page = 1;
    const pageSize = 10;
    const result = await listUsersUseCase.execute(page, pageSize);

    expect(mockUserRepository.list).toHaveBeenCalledWith(page, pageSize);
    expect(result).toEqual(mockUsers);
    expect(result.length).toBe(5);
  });

  it("deve retornar lista vazia quando não houver usuários", async () => {
    mockUserRepository.list.mockResolvedValue([]);

    const result = await listUsersUseCase.execute(1, 10);

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it("deve lidar com diferentes tamanhos de página", async () => {
    const testCases = [
      { page: 1, pageSize: 5 },
      { page: 2, pageSize: 10 },
      { page: 3, pageSize: 20 },
    ];

    for (const testCase of testCases) {
      const mockUsers = createMockUsers(testCase.pageSize);
      mockUserRepository.list.mockResolvedValue(mockUsers);

      const result = await listUsersUseCase.execute(
        testCase.page,
        testCase.pageSize
      );

      expect(mockUserRepository.list).toHaveBeenCalledWith(
        testCase.page,
        testCase.pageSize
      );
      expect(result.length).toBe(testCase.pageSize);
    }
  });

  it("deve propagar erros do repositório", async () => {
    const mockError = new Error("Erro no banco de dados");
    mockUserRepository.list.mockRejectedValue(mockError);

    await expect(listUsersUseCase.execute(1, 10)).rejects.toThrow(mockError);
  });

  it("deve retornar usuários no formato UserResponseDTO", async () => {
    const mockUsers = createMockUsers(2);
    mockUserRepository.list.mockResolvedValue(mockUsers);

    const result = await listUsersUseCase.execute(1, 10);

    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("email");
    expect(result[0]).toHaveProperty("createdAt");
    expect(result[0]).not.toHaveProperty("password"); // Garantir que campos sensíveis não são retornados
    expect(result[0]).not.toHaveProperty("refreshToken"); // Garantir que campos sensíveis não são retornados
  });
});
