import "reflect-metadata";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { ConflictError, NotFoundError } from "@shared/infra/http/errors";
import { UpdateModelUseCase } from "@modules/models/useCases/updateModel/UpdateModelUseCase";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";

describe("UpdateModelUseCase", () => {
  let updateModelUseCase: UpdateModelUseCase;
  let mockModelRepository: jest.Mocked<IModelRepository>;
  let mockBrandRepository: jest.Mocked<IBrandRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockModelRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
    } as any;

    mockBrandRepository = {
      findById: jest.fn(),
    } as any;

    updateModelUseCase = new UpdateModelUseCase(
      mockModelRepository,
      mockBrandRepository
    );
  });

  // Complete mock model with all DTO properties
  const createMockModel = (overrides: any = {}) => ({
    id: "model-id",
    name: "Original Model",
    brandId: "brand-id",
    fipeCode: "original-fipe",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    createdById: "creator-id",
    updatedById: null,
    deletedById: null,
    ...overrides,
  });

  // Complete mock brand
  const createMockBrand = (overrides: any = {}) => ({
    id: "brand-id",
    name: "Test Brand",
    isDeleted: false,
    ...overrides,
  });

  it("deve atualizar um modelo com sucesso", async () => {
    const mockModel = createMockModel();
    const updateData = {
      name: "Updated Model",
      brandId: "new-brand-id",
    };

    mockModelRepository.findById.mockResolvedValue(mockModel);
    mockModelRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.findById.mockResolvedValue(createMockBrand());
    mockModelRepository.update.mockResolvedValue({
      ...mockModel,
      ...updateData,
    });

    const result = await updateModelUseCase.execute(
      "model-id",
      updateData,
      "user-id"
    );

    expect(result.name).toBe("Updated Model");
    expect(result.brandId).toBe("new-brand-id");
  });

  it("deve lançar erro quando modelo não existe", async () => {
    mockModelRepository.findById.mockResolvedValue(null);

    await expect(
      updateModelUseCase.execute(
        "invalid-id",
        { name: "New Name", brandId: "brand-id" },
        "user-id"
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar erro quando nome já está em uso por outro modelo", async () => {
    const mockModel = createMockModel();
    const conflictingModel = createMockModel({
      id: "other-id",
      name: "Existing Model",
    });

    mockModelRepository.findById.mockResolvedValue(mockModel);
    mockModelRepository.findByName.mockResolvedValue(conflictingModel);

    await expect(
      updateModelUseCase.execute(
        "model-id",
        { name: "Existing Model", brandId: "brand-id" },
        "user-id"
      )
    ).rejects.toThrow(ConflictError);
  });

  it("deve lançar erro quando marca não existe", async () => {
    const mockModel = createMockModel();
    const updateData = { name: "model", brandId: "invalid-brand-id" };

    mockModelRepository.findById.mockResolvedValue(mockModel);
    mockBrandRepository.findById.mockResolvedValue(null);

    await expect(
      updateModelUseCase.execute("model-id", updateData, "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve permitir atualização quando novo nome é igual ao nome atual", async () => {
    const mockModel = createMockModel({ name: "Current Name" });
    const updateData = { name: "Current Name", brandId: "brand-id" };

    mockModelRepository.findById.mockResolvedValue(mockModel);
    mockModelRepository.findByName.mockResolvedValue(mockModel);
    mockModelRepository.update.mockResolvedValue(mockModel);
    mockBrandRepository.findById.mockResolvedValue(createMockBrand())

    const result = await updateModelUseCase.execute(
      "model-id",
      updateData,
      "user-id"
    );

    expect(result.name).toBe("Current Name");
  });
});
