import "reflect-metadata";
import { UpdateUserUseCase } from "@modules/users/useCases/updateUser/UpdateUserUseCase";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { UpdateUserDTO } from "@modules/users/dtos/UpdateUserDTO";
import { NotFoundError, ConflictError } from "@shared/infra/http/errors";

describe("UpdateUserUseCase", () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByNationalId: jest.fn(),
      update: jest.fn(),
      // Add other repository methods as needed
    } as any;

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository);
  });

  // Helper function to create mock user
  const createMockUser = (overrides = {}) => ({
    id: "user-id",
    name: "Original User",
    email: "original@example.com",
    password: "123",
    refreshToken: "refresh-token",
    nationalId: "12345678900",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    createdById: null,
    updatedById: null,
    deletedById: null,
    birthdate: null,
    contact: null,
    ...overrides,
  });

  it("deve atualizar um usuário com sucesso", async () => {
    const mockUser = createMockUser();
    const updateData: UpdateUserDTO = { name: "Updated User" };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue({
      ...mockUser,
      ...updateData,
    });

    const result = await updateUserUseCase.execute(
      "user-id",
      updateData,
      "user-id"
    );

    expect(mockUserRepository.findById).toHaveBeenCalledWith("user-id");
    expect(mockUserRepository.update).toHaveBeenCalledWith(
      "user-id",
      updateData,
      "user-id"
    );
    expect(result.name).toBe("Updated User");
  });

  it("deve lançar erro quando usuário não existe", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      updateUserUseCase.execute("invalid-id", { name: "New Name" }, "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar erro quando email já está em uso por outro usuário", async () => {
    const mockUser = createMockUser();
    const conflictingUser = createMockUser({
      id: "other-id",
      email: "existing@example.com",
    });

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.findByEmail.mockResolvedValue(conflictingUser);

    await expect(
      updateUserUseCase.execute(
        "user-id",
        { email: "existing@example.com" },
        "user-id"
      )
    ).rejects.toThrow(ConflictError);
  });

  it("deve lançar erro quando CPF já está em uso por outro usuário", async () => {
    const mockUser = createMockUser();
    const conflictingUser = createMockUser({
      id: "other-id",
      nationalId: "98765432100",
    });

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.findByNationalId.mockResolvedValue(conflictingUser);

    await expect(
      updateUserUseCase.execute(
        "user-id",
        { nationalId: "98765432100" },
        "user-id"
      )
    ).rejects.toThrow(ConflictError);
  });

  it("deve permitir atualização quando novo email é igual ao email atual", async () => {
    const mockUser = createMockUser({ email: "current@example.com" });
    const updateData: UpdateUserDTO = { email: "current@example.com" };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);

    const result = await updateUserUseCase.execute(
      "user-id",
      updateData,
      "user-id"
    );

    expect(result.email).toBe("current@example.com");
    expect(mockUserRepository.update).toHaveBeenCalled();
  });

  it("deve permitir atualização quando novo CPF é igual ao CPF atual", async () => {
    const mockUser = createMockUser({ nationalId: "12345678900" });
    const updateData: UpdateUserDTO = { nationalId: "12345678900" };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.findByNationalId.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);

    const result = await updateUserUseCase.execute(
      "user-id",
      updateData,
      "user-id"
    );

    expect(result.nationalId).toBe("12345678900");
    expect(mockUserRepository.update).toHaveBeenCalled();
  });

  it("deve incluir o updatedById na atualização", async () => {
    const mockUser = createMockUser();
    const updateData: UpdateUserDTO = { name: "Updated User" };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue({
      ...mockUser,
      ...updateData,
    });

    await updateUserUseCase.execute("user-id", updateData, "specific-user-id");

    expect(mockUserRepository.update).toHaveBeenCalledWith(
      "user-id",
      updateData,
      "specific-user-id"
    );
  });

  it("deve atualizar múltiplos campos simultaneamente", async () => {
    const mockUser = createMockUser();
    const updateData: UpdateUserDTO = {
      name: "Updated User",
      email: "new@example.com",
      nationalId: "11122233344",
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByNationalId.mockResolvedValue(null);
    mockUserRepository.update.mockResolvedValue({
      ...mockUser,
      ...updateData,
    });

    const result = await updateUserUseCase.execute(
      "user-id",
      updateData,
      "user-id"
    );

    expect(result.name).toBe("Updated User");
    expect(result.email).toBe("new@example.com");
    expect(result.nationalId).toBe("11122233344");
  });
});
