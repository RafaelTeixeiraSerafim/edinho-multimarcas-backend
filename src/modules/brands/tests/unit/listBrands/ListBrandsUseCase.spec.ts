import "reflect-metadata";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { ListBrandsUseCase } from "@modules/brands/useCases/listBrands/ListBrandsUseCase";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";

describe("ListBrandsUseCase", () => {
  let listBrandsUseCase: ListBrandsUseCase;
  let mockBrandRepository: jest.Mocked<IBrandRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockBrandRepository = {
      list: jest.fn(),
      // Add other repository methods if needed
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
    };

    listBrandsUseCase = new ListBrandsUseCase(mockBrandRepository);
  });

  // Helper para criar mock de marcas
  const createMockBrands = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `brand-${i + 1}`,
      name: `Brand ${i + 1}`,
      fipeCode: `code-${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      deletedAt: null,
      createdById: "usuario-id",
      updatedById: null,
      deletedById: null,
    }));
  };

  it("deve listar marcas com paginação correta", async () => {
    const mockBrands = createMockBrands(5);
    mockBrandRepository.list.mockResolvedValue(mockBrands);

    const page = 1;
    const pageSize = 10;
    const result = await listBrandsUseCase.execute(page, pageSize);

    expect(mockBrandRepository.list).toHaveBeenCalledWith(page, pageSize);
    expect(result).toEqual(mockBrands);
    expect(result.length).toBe(5);
  });

  it("deve retornar lista vazia quando não houver marcas", async () => {
    mockBrandRepository.list.mockResolvedValue([]);

    const result = await listBrandsUseCase.execute(1, 10);

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
      const mockBrands = createMockBrands(testCase.pageSize);
      mockBrandRepository.list.mockResolvedValue(mockBrands);

      const result = await listBrandsUseCase.execute(
        testCase.page,
        testCase.pageSize
      );

      expect(mockBrandRepository.list).toHaveBeenCalledWith(
        testCase.page,
        testCase.pageSize
      );
      expect(result.length).toBe(testCase.pageSize);
    }
  });

  it("deve propagar erros do repositório", async () => {
    const mockError = new Error("Database error");
    mockBrandRepository.list.mockRejectedValue(mockError);

    await expect(listBrandsUseCase.execute(1, 10)).rejects.toThrow(mockError);
  });
});
