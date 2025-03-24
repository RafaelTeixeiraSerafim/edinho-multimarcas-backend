import "reflect-metadata";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { ConflictError, NotFoundError } from "@shared/infra/http/errors";
import { CreateModelUseCase } from "@modules/models/useCases/createModel/CreateModelUseCase";

describe("CreateModelUseCase", () => {
  let createModelUseCase: CreateModelUseCase;
  let mockModelRepository: jest.Mocked<IModelRepository>;
  let mockBrandRepository: jest.Mocked<IBrandRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockModelRepository = {
      create: jest.fn(),
      findByName: jest.fn(),
      // Add other methods as needed
    } as any;

    mockBrandRepository = {
      findById: jest.fn(),
      // Add other methods as needed
    } as any;

    createModelUseCase = new CreateModelUseCase(
      mockModelRepository,
      mockBrandRepository
    );
  });

  // Helper to create mock model
  const createMockModel = (overrides: any = {}) => ({
    id: "model-id",
    name: "Test Model",
    fipeCode: "123",
    brandId: "brand-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    ...overrides,
  });

  it("deve criar um modelo com sucesso", async () => {
    const mockData = {
      name: "New Model",
      fipeCode: "1234",
      brandId: "brand-id",
    };

    mockModelRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.findById.mockResolvedValue(createMockModel());
    mockModelRepository.create.mockResolvedValue(createMockModel(mockData));

    const result = await createModelUseCase.execute(mockData, "user-id");

    expect(mockModelRepository.findByName).toHaveBeenCalledWith("New Model");
    expect(mockBrandRepository.findById).toHaveBeenCalledWith("brand-id");
    expect(mockModelRepository.create).toHaveBeenCalledWith(mockData, "user-id");
    expect(result.name).toBe("New Model");
  });

  it("deve lançar erro quando modelo com mesmo nome já existe", async () => {
    const mockData = {
      name: "Existing Model",
      brandId: "brand-id",
    };

    mockModelRepository.findByName.mockResolvedValue(createMockModel());

    await expect(
      createModelUseCase.execute(mockData, "user-id")
    ).rejects.toThrow(ConflictError);
  });

  it("deve lançar erro quando marca não existe", async () => {
    const mockData = {
      name: "New Model",
      brandId: "invalid-brand-id",
    };

    mockModelRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.findById.mockResolvedValue(null);

    await expect(
      createModelUseCase.execute(mockData, "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve criar modelo sem código fipe quando não fornecido", async () => {
    const mockData = {
      name: "Model Without Fipe",
      brandId: "brand-id",
    };

    mockModelRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.findById.mockResolvedValue(createMockModel());
    mockModelRepository.create.mockResolvedValue(createMockModel({
      ...mockData,
      fipeCode: undefined
    }));

    const result = await createModelUseCase.execute(mockData, "user-id");

    expect(result.fipeCode).toBeUndefined();
  });

  it("deve incluir createdBy no registro criado", async () => {
    const mockData = {
      name: "Model with Creator",
      brandId: "brand-id",
    };

    mockModelRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.findById.mockResolvedValue(createMockModel());
    mockModelRepository.create.mockResolvedValue(
      createMockModel({ ...mockData, createdById: "specific-user-id" })
    );

    const result = await createModelUseCase.execute(mockData, "specific-user-id");

    expect(result.createdById).toBe("specific-user-id");
  });
});