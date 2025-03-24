import "reflect-metadata";
import { ConflictError, NotFoundError } from "@shared/infra/http/errors";
import { UpdateBrandUseCase } from "@modules/brands/useCases/updateBrand/UpdateBrandUseCase";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";

describe("UpdateBrandUseCase", () => {
  let updateBrandUseCase: UpdateBrandUseCase;
  let mockBrandRepository: jest.Mocked<IBrandRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockBrandRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      // Add other repository methods as needed
    } as any;

    updateBrandUseCase = new UpdateBrandUseCase(mockBrandRepository);
  });

  // Helper function to create mock brand
  const createMockBrand = (overrides = {}) => ({
    id: "brand-id",
    name: "Original Brand",
    isDeleted: false,
    fipeCode: "123",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    createdById: "usuario-id",
    updatedById: null,
    deletedById: null,
    ...overrides,
  });

  it("deve atualizar uma marca com sucesso", async () => {
    const mockBrand = createMockBrand();
    const updateData = { name: "Updated Brand" };

    mockBrandRepository.findById.mockResolvedValue(mockBrand);
    mockBrandRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.update.mockResolvedValue({
      ...mockBrand,
      ...updateData,
    });

    const result = await updateBrandUseCase.execute(
      "brand-id",
      updateData,
      "user-id"
    );

    expect(mockBrandRepository.findById).toHaveBeenCalledWith("brand-id");
    expect(mockBrandRepository.findByName).toHaveBeenCalledWith(
      "Updated Brand"
    );
    expect(mockBrandRepository.update).toHaveBeenCalledWith(
      "brand-id",
      updateData,
      "user-id"
    );
    expect(result.name).toBe("Updated Brand");
  });

  it("deve lançar erro quando marca não existe", async () => {
    mockBrandRepository.findById.mockResolvedValue(null);

    await expect(
      updateBrandUseCase.execute("invalid-id", { name: "New Name" }, "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar erro quando nome já está em uso por outra marca", async () => {
    const mockBrand = createMockBrand();
    const conflictingBrand = createMockBrand({
      id: "other-id",
      name: "Existing Brand",
    });

    mockBrandRepository.findById.mockResolvedValue(mockBrand);
    mockBrandRepository.findByName.mockResolvedValue(conflictingBrand);

    await expect(
      updateBrandUseCase.execute(
        "brand-id",
        { name: "Existing Brand" },
        "user-id"
      )
    ).rejects.toThrow(ConflictError);
  });

  it("deve permitir atualização quando novo nome é igual ao nome atual", async () => {
    const mockBrand = createMockBrand({ name: "Current Name" });
    const updateData = { name: "Current Name" };

    mockBrandRepository.findById.mockResolvedValue(mockBrand);
    mockBrandRepository.findByName.mockResolvedValue(mockBrand);
    mockBrandRepository.update.mockResolvedValue(mockBrand);

    const result = await updateBrandUseCase.execute(
      "brand-id",
      updateData,
      "user-id"
    );

    expect(result.name).toBe("Current Name");
    expect(mockBrandRepository.update).toHaveBeenCalled();
  });

  it("deve incluir o updatedById na atualização", async () => {
    const mockBrand = createMockBrand();
    const updateData = { name: "Updated Brand" };

    mockBrandRepository.findById.mockResolvedValue(mockBrand);
    mockBrandRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.update.mockResolvedValue({
      ...mockBrand,
      ...updateData,
    });

    await updateBrandUseCase.execute(
      "brand-id",
      updateData,
      "specific-user-id"
    );

    expect(mockBrandRepository.update).toHaveBeenCalledWith(
      "brand-id",
      updateData,
      "specific-user-id"
    );
  });
});
