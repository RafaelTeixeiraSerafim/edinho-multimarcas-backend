import "reflect-metadata";
import { IFuelTypeRepository } from "@modules/fuelTypes/repositories/IFuelTypeRepository";
import { ListFuelTypesUseCase } from "@modules/fuelTypes/useCases/listFuelTypes/ListFuelTypesUseCase";

// Mock the FuelTypeRepository
const mockFuelTypeRepository: jest.Mocked<IFuelTypeRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  list: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
};

describe("ListFuelTypesUseCase", () => {
  let listFuelTypesUseCase: ListFuelTypesUseCase;

  beforeEach(() => {
    // Create an instance of the use case with the mocked repository
    listFuelTypesUseCase = new ListFuelTypesUseCase(mockFuelTypeRepository);
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("deve retornar uma lista de tipos de combustível com paginação", async () => {
    // Arrange
    const page = 1;
    const pageSize = 10;

    const mockFuelTypes = [
      {
        id: "fuel-type-123",
        name: "Gasoline",
        abbreviation: "G",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isDeleted: false,
        createdById: "user-123",
        updatedById: null,
        deletedById: null,
        vehicles: [],
      },
      {
        id: "fuel-type-456",
        name: "Diesel",
        abbreviation: "D",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isDeleted: false,
        createdById: "user-456",
        updatedById: null,
        deletedById: null,
        vehicles: [],
      },
    ];

    mockFuelTypeRepository.list.mockResolvedValue(mockFuelTypes);

    // Act
    const result = await listFuelTypesUseCase.execute(page, pageSize);

    // Assert
    expect(mockFuelTypeRepository.list).toHaveBeenCalledWith(page, pageSize);
    expect(result).toEqual(mockFuelTypes);
  });

  it("deve retornar uma lista vazia se nenhum tipo de combustível for encontrado", async () => {
    // Arrange
    const page = 1;
    const pageSize = 10;

    mockFuelTypeRepository.list.mockResolvedValue([]);

    // Act
    const result = await listFuelTypesUseCase.execute(page, pageSize);

    // Assert
    expect(mockFuelTypeRepository.list).toHaveBeenCalledWith(page, pageSize);
    expect(result).toEqual([]);
  });

  it("deve cuidar de erros mandados pelo repositório", async () => {
    // Arrange
    const page = 1;
    const pageSize = 10;

    const mockError = new Error("Database error");
    mockFuelTypeRepository.list.mockRejectedValue(mockError);

    // Act & Assert
    await expect(listFuelTypesUseCase.execute(page, pageSize)).rejects.toThrow(
      mockError
    );
    expect(mockFuelTypeRepository.list).toHaveBeenCalledWith(page, pageSize);
  });
});
