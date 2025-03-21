import "reflect-metadata"
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { IFuelTypeRepository } from "../../../repositories/IFuelTypeRepository";
import { CreateFuelTypeDTO } from "../../../dtos/CreateFuelTypeDTO";
import { CreateFuelTypeUseCase } from "@modules/fuelTypes/useCases/createFuelType/CreateFuelTypeUseCase";

// Mock the FuelTypeRepository
const mockFuelTypeRepository: jest.Mocked<IFuelTypeRepository> = {
  findByName: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  list: jest.fn(),
  findById: jest.fn(),
  delete: jest.fn(),
};

describe("CreateFuelTypeUseCase", () => {
  let createFuelTypeUseCase: CreateFuelTypeUseCase;

  beforeEach(() => {
    // Create a new instance of the use case with the mocked repository
    createFuelTypeUseCase = new CreateFuelTypeUseCase(mockFuelTypeRepository);
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("deve criar um novo tipo de combustível se o nome não estiver em uso", async () => {
    // Arrange
    const data: CreateFuelTypeDTO = { name: "Gasoline", abbreviation: "G" };
    const createdById = "user-123";

    const mockFuelType = {
      id: "fuel-type-123",
      name: data.name,
      abbreviation: data.abbreviation,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isDeleted: false,
      createdById,
      updatedById: null,
      deletedById: null,
      vehicles: [],
    };

    mockFuelTypeRepository.findByName.mockResolvedValue(null); // Simulate no existing fuel type
    mockFuelTypeRepository.create.mockResolvedValue(mockFuelType);

    // Act
    const result = await createFuelTypeUseCase.execute(data, createdById);

    // Assert
    expect(mockFuelTypeRepository.findByName).toHaveBeenCalledWith(data.name);
    expect(mockFuelTypeRepository.create).toHaveBeenCalledWith(data, createdById);
    expect(result).toEqual(mockFuelType);
  });

  it("deve mandar um ConflictError se um tipo de combustível com o mesmo nome já existe", async () => {
    // Arrange
    const data: CreateFuelTypeDTO = { name: "Gasoline", abbreviation: "G" };
    const createdById = "user-123";

    const existingFuelType = {
      id: "fuel-type-456",
      name: data.name,
      abbreviation: data.abbreviation,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isDeleted: false,
      createdById: "user-456",
      updatedById: null,
      deletedById: null,
      vehicles: [],
    };

    mockFuelTypeRepository.findByName.mockResolvedValue(existingFuelType);

    // Act & Assert
    await expect(
      createFuelTypeUseCase.execute(data, createdById)
    ).rejects.toThrow(ConflictError);

    expect(mockFuelTypeRepository.findByName).toHaveBeenCalledWith(data.name);
    expect(mockFuelTypeRepository.create).not.toHaveBeenCalled();
  });
});
