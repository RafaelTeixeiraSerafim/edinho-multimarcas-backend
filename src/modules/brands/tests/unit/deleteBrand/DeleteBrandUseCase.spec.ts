import "reflect-metadata";
import { DeleteBrandUseCase } from "@modules/brands/useCases/deleteBrand/DeleteBrandUseCase";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { DeleteModelUseCase } from "@modules/models/useCases/deleteModel/DeleteModelUseCase";
import { NotFoundError } from "@shared/infra/http/errors";
import { container } from "tsyringe";

// Mock the repositories and use case
jest.mock("@modules/brands/repositories/IBrandRepository");
jest.mock("@modules/models/repositories/IModelRepository");

describe("DeleteBrandUseCase", () => {
  let deleteBrandUseCase: DeleteBrandUseCase;
  let mockBrandRepository: jest.Mocked<IBrandRepository>;
  let mockModelRepository: jest.Mocked<IModelRepository>;
  let mockDeleteModelUseCase: jest.Mocked<DeleteModelUseCase>;
  let mockResolve: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockBrandRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
      // Add other methods if needed
    } as any;

    mockModelRepository = {
      findByBrandId: jest.fn(),
      // Add other methods if needed
    } as any;

    mockDeleteModelUseCase = {
      execute: jest.fn(),
    } as any;

    deleteBrandUseCase = new DeleteBrandUseCase(
      mockBrandRepository,
      mockModelRepository
    );

    mockResolve = jest.spyOn(container, "resolve");
  });

  // Helper to create mock brand
  const createMockBrand = (overrides: any = {}) => ({
    id: "brand-id",
    name: "Test Brand",
    isDeleted: false,
    ...overrides,
  });

  // Helper to create mock model
  const createMockModel = (overrides: any = {}) => ({
    id: "model-id",
    name: "Test Model",
    brandId: "brand-id",
    ...overrides,
  });

  it("deve deletar uma marca e seus modelos com sucesso", async () => {
    const mockBrand = createMockBrand();
    const mockModels = [
      createMockModel(),
      createMockModel({ id: "model-id-2" }),
    ];

    mockBrandRepository.findById.mockResolvedValue(mockBrand);
    mockModelRepository.findByBrandId.mockResolvedValue(mockModels);
    mockResolve.mockReturnValue(mockDeleteModelUseCase);

    await deleteBrandUseCase.execute("brand-id", "user-id");

    expect(mockBrandRepository.findById).toHaveBeenCalledWith("brand-id");
    expect(mockModelRepository.findByBrandId).toHaveBeenCalledWith("brand-id");
    expect(mockDeleteModelUseCase.execute).toHaveBeenCalledTimes(2);
    expect(mockBrandRepository.delete).toHaveBeenCalledWith(
      "brand-id",
      "user-id"
    );
  });

  it("deve lançar erro quando marca não existe", async () => {
    mockBrandRepository.findById.mockResolvedValue(null);

    await expect(
      deleteBrandUseCase.execute("invalid-id", "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar erro quando marca já está deletada", async () => {
    const deletedBrand = createMockBrand({ isDeleted: true });
    mockBrandRepository.findById.mockResolvedValue(deletedBrand);

    await expect(
      deleteBrandUseCase.execute("brand-id", "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve deletar marca mesmo sem modelos associados", async () => {
    const mockBrand = createMockBrand();
    mockBrandRepository.findById.mockResolvedValue(mockBrand);
    mockModelRepository.findByBrandId.mockResolvedValue([]);

    await deleteBrandUseCase.execute("brand-id", "user-id");

    expect(mockDeleteModelUseCase.execute).not.toHaveBeenCalled();
    expect(mockBrandRepository.delete).toHaveBeenCalled();
  });

  it("deve passar o deletedById corretamente para os modelos e marca", async () => {
    const mockBrand = createMockBrand();
    const mockModels = [createMockModel()];
    const deletedById = "user-id-123";

    mockBrandRepository.findById.mockResolvedValue(mockBrand);
    mockModelRepository.findByBrandId.mockResolvedValue(mockModels);

    mockResolve.mockReturnValue(mockDeleteModelUseCase);

    await deleteBrandUseCase.execute("brand-id", deletedById);

    expect(mockDeleteModelUseCase.execute).toHaveBeenCalledWith(
      "model-id",
      deletedById
    );
    expect(mockBrandRepository.delete).toHaveBeenCalledWith(
      "brand-id",
      deletedById
    );
  });
});
