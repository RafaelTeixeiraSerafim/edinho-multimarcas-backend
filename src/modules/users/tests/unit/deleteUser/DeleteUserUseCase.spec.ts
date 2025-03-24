import "reflect-metadata"
import { DeleteUserUseCase } from "@modules/users/useCases/deleteUser/DeleteUserUseCase";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { ForbiddenError } from "@shared/infra/http/errors/ForbiddenError";

// Mock the repository
jest.mock("@modules/users/repositories/IUserRepository");

describe("DeleteUserUseCase", () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
      // Add other methods if needed
    } as any;

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
  });

  // Helper to create mock user
  const createMockUser = (overrides: any = {}) => ({
    id: "user-id",
    name: "Test User",
    email: "test@example.com",
    isDeleted: false,
    ...overrides,
  });

  it("deve deletar um usuário com sucesso quando o usuário existe e está se auto-deletando", async () => {
    const mockUser = createMockUser();
    mockUserRepository.findById.mockResolvedValue(mockUser);

    await deleteUserUseCase.execute("user-id", "user-id");

    expect(mockUserRepository.findById).toHaveBeenCalledWith("user-id");
    expect(mockUserRepository.delete).toHaveBeenCalledWith(
      "user-id",
      "user-id"
    );
  });

  it("deve lançar NotFoundError quando o usuário não existe", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      deleteUserUseCase.execute("non-existent-id", "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar NotFoundError quando o usuário já está deletado", async () => {
    const deletedUser = createMockUser({ isDeleted: true });
    mockUserRepository.findById.mockResolvedValue(deletedUser);

    await expect(
      deleteUserUseCase.execute("user-id", "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar ForbiddenError quando um usuário tenta deletar outro usuário", async () => {
    const mockUser = createMockUser();
    mockUserRepository.findById.mockResolvedValue(mockUser);

    await expect(
      deleteUserUseCase.execute("user-id", "different-user-id")
    ).rejects.toThrow(ForbiddenError);
  });

  it("deve passar o deletedById corretamente para o repositório", async () => {
    const mockUser = createMockUser({ id: "user-123" });
    const deletedById = "user-123";

    mockUserRepository.findById.mockResolvedValue(mockUser);

    await deleteUserUseCase.execute("user-123", deletedById);

    expect(mockUserRepository.delete).toHaveBeenCalledWith(
      "user-123",
      deletedById
    );
  });

  it("não deve chamar delete quando ForbiddenError é lançado", async () => {
    const mockUser = createMockUser();
    mockUserRepository.findById.mockResolvedValue(mockUser);

    try {
      await deleteUserUseCase.execute("user-id", "different-user-id");
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
    }

    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });

  it("não deve chamar delete quando NotFoundError é lançado", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    try {
      await deleteUserUseCase.execute("non-existent-id", "user-id");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }

    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });
});
