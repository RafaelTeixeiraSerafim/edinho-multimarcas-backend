import "reflect-metadata"
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { ListModelsUseCase } from "@modules/models/useCases/listModels/ListModelsUseCase";
import "reflect-metadata";

describe("ListModelsUseCase", () => {
  let listModelsUseCase: ListModelsUseCase;
  let mockModelRepository: jest.Mocked<IModelRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockModelRepository = {
      list: jest.fn(),
      // Add other repository methods if needed
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findByBrandId: jest.fn(),
      findByName: jest.fn(),
    };

    listModelsUseCase = new ListModelsUseCase(mockModelRepository);
  });

  // Helper function to create mock models
  const createMockModels = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `model-${i + 1}`,
      name: `Model ${i + 1}`,
      fipeCode: `code-${i + 1}`,
      brandId: `brand-${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      deletedAt: null,
      createdById: "user-id",
      updatedById: null,
      deletedById: null,
    }));
  };

  it("deve listar modelos com paginação correta", async () => {
    const mockModels = createMockModels(5);
    const page = 1;
    const pageSize = 10;

    mockModelRepository.list.mockResolvedValue(mockModels);

    const result = await listModelsUseCase.execute(page, pageSize);

    expect(mockModelRepository.list).toHaveBeenCalledWith(page, pageSize);
    expect(result).toEqual(mockModels);
    expect(result.length).toBe(5);
  });

  it("deve retornar lista vazia quando não houver modelos", async () => {
    mockModelRepository.list.mockResolvedValue([]);

    const result = await listModelsUseCase.execute(1, 10);

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
      const mockModels = createMockModels(testCase.pageSize);
      mockModelRepository.list.mockResolvedValue(mockModels);

      const result = await listModelsUseCase.execute(
        testCase.page,
        testCase.pageSize
      );

      expect(mockModelRepository.list).toHaveBeenCalledWith(
        testCase.page,
        testCase.pageSize
      );
      expect(result.length).toBe(testCase.pageSize);
    }
  });

  it("deve propagar erros do repositório", async () => {
    const mockError = new Error("Database error");
    mockModelRepository.list.mockRejectedValue(mockError);

    await expect(listModelsUseCase.execute(1, 10)).rejects.toThrow(mockError);
  });
});
