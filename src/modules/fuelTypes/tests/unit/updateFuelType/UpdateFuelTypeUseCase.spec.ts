import "reflect-metadata"
import { UpdateFuelTypeDTO } from "@modules/fuelTypes/dtos/UpdateFuelTypeDTO";
import { IFuelTypeRepository } from "@modules/fuelTypes/repositories/IFuelTypeRepository";
import { UpdateFuelTypeUseCase } from "@modules/fuelTypes/useCases/updateFuelType/UpdateFuelTypeUseCase";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { NotFoundError } from "@shared/infra/http/errors";

// Complete mock repository with all methods
const mockFuelTypeRepository: jest.Mocked<IFuelTypeRepository> = {
  findById: jest.fn(),
  findByName: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  list: jest.fn(),
  // Add any other methods from your interface
};

// Helper to create complete mock fuel types
const createMockFuelType = (overrides: any = {}) => ({
  id: "valid-id",
  name: "old-name",
  abbreviation: "old-abbr",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  isDeleted: false,
  createdById: "creator-id",
  updatedById: null,
  deletedById: null,
  vehicles: [],
  createdBy: null,
  updatedBy: null,
  deletedBy: null,
  ...overrides,
});

describe("UpdateFuelTypeUseCase", () => {
  let updateFuelTypeUseCase: UpdateFuelTypeUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    updateFuelTypeUseCase = new UpdateFuelTypeUseCase(mockFuelTypeRepository);
  });

  it("deve atualizar o tipo de combustível corretamente com todos os campos", async () => {
    const mockFuelType = createMockFuelType();
    const updateData: UpdateFuelTypeDTO = {
      name: "new-name",
      abbreviation: "new-abbr",
    };

    mockFuelTypeRepository.findById.mockResolvedValue(mockFuelType);
    mockFuelTypeRepository.findByName.mockResolvedValue(null);
    mockFuelTypeRepository.update.mockResolvedValue({
      ...mockFuelType,
      ...updateData,
      updatedAt: new Date(),
      updatedById: "updater-id",
    });

    const result = await updateFuelTypeUseCase.execute(
      "valid-id",
      updateData,
      "updater-id"
    );

    expect(mockFuelTypeRepository.update).toHaveBeenCalledWith(
      "valid-id",
      expect.objectContaining({
        name: "new-name",
        abbreviation: "new-abbr",
      }),
      "updater-id"
    );
    expect(result.updatedById).toBe("updater-id");
  });

  it("deve atualizar apenar campos fornecidos", async () => {
    const mockFuelType = createMockFuelType();
    const updateData: UpdateFuelTypeDTO = {
      abbreviation: "updated-abbr",
    };

    mockFuelTypeRepository.findById.mockResolvedValue(mockFuelType);
    mockFuelTypeRepository.update.mockResolvedValue({
      ...mockFuelType,
      ...updateData,
    });

    const result = await updateFuelTypeUseCase.execute(
      "valid-id",
      updateData,
      "updater-id"
    );

    expect(mockFuelTypeRepository.findByName).not.toHaveBeenCalled();
    expect(result.name).toBe("old-name"); // Should remain unchanged
    expect(result.abbreviation).toBe("updated-abbr");
  });

  it("deve mandar um NotFoundError quando o combustível não for encontrado", async () => {
    mockFuelTypeRepository.findById.mockResolvedValue(null);

    await expect(
      updateFuelTypeUseCase.execute(
        "valid-id",
        { name: "name" },
        "updater-id"
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("deve mandar um ConflictError quando o nome fornecido já estiver em uso", async () => {
    const mockFuelType = createMockFuelType();
    const conflictingFuelType = createMockFuelType({
      id: "other-id",
      name: "existing-name",
    });

    mockFuelTypeRepository.findById.mockResolvedValue(mockFuelType);
    mockFuelTypeRepository.findByName.mockResolvedValue(conflictingFuelType);

    await expect(
      updateFuelTypeUseCase.execute(
        "valid-id",
        { name: "existing-name" },
        "updater-id"
      )
    ).rejects.toThrow(ConflictError);
  });

  it("deve atualizar as datas corretamente", async () => {
    const originalDate = new Date("2023-01-01");
    const mockFuelType = createMockFuelType({
      createdAt: originalDate,
      updatedAt: originalDate,
    });
    const updateData: UpdateFuelTypeDTO = {
      name: "updated-name",
    };

    mockFuelTypeRepository.findById.mockResolvedValue(mockFuelType);
    mockFuelTypeRepository.findByName.mockResolvedValue(null);
    mockFuelTypeRepository.update.mockResolvedValue({
      ...mockFuelType,
      ...updateData,
      updatedAt: new Date(),
    });

    const result = await updateFuelTypeUseCase.execute(
      "valid-id",
      updateData,
      "updater-id"
    );

    expect(result.createdAt).toEqual(originalDate);
    expect(result.updatedAt).not.toEqual(originalDate);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });
});