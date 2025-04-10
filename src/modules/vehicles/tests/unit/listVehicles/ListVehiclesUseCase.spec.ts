import "reflect-metadata";
import { ListVehiclesUseCase } from "@modules/vehicles/useCases/listVehicles/ListVehiclesUseCase";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";

describe("ListVehiclesUseCase", () => {
  let listVehiclesUseCase: ListVehiclesUseCase;
  let mockVehicleRepository: jest.Mocked<IVehicleRepository>;

  // Helper function to create mock vehicles
  const createMockVehicles = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `vehicle-${i + 1}`,
      fipeCode: `code-${i + 1}`,
      value: 50000 + i * 10000,
      referenceMonth: 6,
      referenceYear: 2023,
      vehicleYear: 2023,
      modelId: `model-${i + 1}`,
      fuelTypeId: `fuel-${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isDeleted: false,
      createdById: "user-id",
      updatedById: null,
      deletedById: null,
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockVehicleRepository = {
      list: jest.fn(),
      // Add other repository methods if needed
    } as any;

    listVehiclesUseCase = new ListVehiclesUseCase(mockVehicleRepository);
  });

  it("deve listar veículos com paginação correta", async () => {
    const mockVehicles = createMockVehicles(5);
    mockVehicleRepository.list.mockResolvedValue(mockVehicles);

    const page = 0;
    const pageSize = 10;
    const result = await listVehiclesUseCase.execute(page, pageSize);

    expect(mockVehicleRepository.list).toHaveBeenCalledWith(page, pageSize);
    expect(result).toEqual(mockVehicles);
    expect(result.length).toBe(5);
  });

  it("deve retornar lista vazia quando não houver veículos", async () => {
    mockVehicleRepository.list.mockResolvedValue([]);

    const result = await listVehiclesUseCase.execute(1, 10);

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
      const mockVehicles = createMockVehicles(testCase.pageSize);
      mockVehicleRepository.list.mockResolvedValue(mockVehicles);

      const result = await listVehiclesUseCase.execute(
        testCase.page,
        testCase.pageSize
      );

      expect(mockVehicleRepository.list).toHaveBeenCalledWith(
        testCase.page,
        testCase.pageSize
      );
      expect(result.length).toBe(testCase.pageSize);
    }
  });

  it("deve propagar erros do repositório", async () => {
    const mockError = new Error("Erro no banco de dados");
    mockVehicleRepository.list.mockRejectedValue(mockError);

    await expect(listVehiclesUseCase.execute(1, 10)).rejects.toThrow(mockError);
  });

  it("deve retornar veículos com estrutura correta", async () => {
    const mockVehicles = createMockVehicles(2);
    mockVehicleRepository.list.mockResolvedValue(mockVehicles);

    const result = await listVehiclesUseCase.execute(1, 10);

    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("value");
    expect(result[0]).toHaveProperty("modelId");
    expect(result[0]).toHaveProperty("fuelTypeId");
    expect(result[0]).toHaveProperty("createdAt");
    expect(result[0]).not.toHaveProperty("password"); // Garantir que campos sensíveis não são retornados
  });
});
