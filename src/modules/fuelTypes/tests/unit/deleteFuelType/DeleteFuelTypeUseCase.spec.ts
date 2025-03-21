import "reflect-metadata";
import { IFuelTypeRepository } from "@modules/fuelTypes/repositories/IFuelTypeRepository";
import { DeleteFuelTypeUseCase } from "@modules/fuelTypes/useCases/deleteFuelType/DeleteFuelTypeUseCase";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { IVehicle } from "@modules/vehicles/interfaces/IVehicle";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";

const mockFuelTypeRepository: jest.Mocked<IFuelTypeRepository> = {
  findByName: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  list: jest.fn(),
  findById: jest.fn(),
  delete: jest.fn(),
};

const mockVehicleRepository: jest.Mocked<IVehicleRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  list: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
  findByModelId: jest.fn(),
  findByFuelTypeId: jest.fn(),
  findExistingVehicle: jest.fn(),
};

describe("DeleteFuelTypeUseCase", () => {
  let deleteFuelTypeUseCase: DeleteFuelTypeUseCase;

  beforeEach(() => {
    deleteFuelTypeUseCase = new DeleteFuelTypeUseCase(
      mockFuelTypeRepository,
      mockVehicleRepository
    );

    jest.clearAllMocks();
  });

  it("deve excluir um tipo de combustível se ele for encontrado e não estiver sendo utilizado por nenhum veículo", async () => {
    const id = "fuel-type-123";
    const deletedById = "user-123";

    const mockFuelType = {
      id: "fuel-type-123",
      name: "Gasolina",
      abbreviation: "G",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isDeleted: false,
      createdById: "user-123",
      updatedById: null,
      deletedById,
      vehicles: [],
    };

    mockFuelTypeRepository.findById.mockResolvedValue(mockFuelType);
    mockVehicleRepository.findByFuelTypeId.mockResolvedValue([]);
    mockFuelTypeRepository.delete.mockResolvedValue(undefined);

    await deleteFuelTypeUseCase.execute(id, deletedById);

    expect(mockFuelTypeRepository.findById).toHaveBeenCalledWith(id);
    expect(mockVehicleRepository.findByFuelTypeId).toHaveBeenCalledWith(id);
    expect(mockFuelTypeRepository.delete).toHaveBeenCalledWith(id, deletedById);
  });

  it("deve mandar um NotFoundError se o tipo de combustível não existe ou já foi excluído", async () => {
    const id = "fuel-type-123";
    const deletedById = "user-123";

    mockFuelTypeRepository.findById.mockResolvedValue(null);

    await expect(
      deleteFuelTypeUseCase.execute(id, deletedById)
    ).rejects.toThrow(NotFoundError);

    expect(mockFuelTypeRepository.findById).toHaveBeenCalledWith(id);
    expect(mockVehicleRepository.findByFuelTypeId).not.toHaveBeenCalled();
    expect(mockVehicleRepository.delete).not.toHaveBeenCalled();
  });

  it("deve mandar um ConflictError se o tipo de combustível estiver sendo utilizado por um ou mais veículo(s)", async () => {
    const id = "fuel-type-123";
    const deletedById = "user-123";

    const mockFuelType = {
      id: "fuel-type-123",
      name: "Gasolina",
      abbreviation: "G",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isDeleted: false,
      createdById: "user-123",
      updatedById: null,
      deletedById,
      vehicles: [],
    };

    const mockVehicles: IVehicle[] = [
      {
        id: "vehicle-123",
        fipeCode: null,
        value: 10000,
        vehicleYear: 2000,
        referenceMonth: 1,
        referenceYear: 2000,
        isDeleted: false,
        modelId: "model-123",
        fuelTypeId: "fuel-type-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        createdById: "user-123",
        updatedById: null,
        deletedById: null,
      },
    ];

    mockFuelTypeRepository.findById.mockResolvedValue(mockFuelType);
    mockVehicleRepository.findByFuelTypeId.mockResolvedValue(mockVehicles);

    await expect(
      deleteFuelTypeUseCase.execute(id, deletedById)
    ).rejects.toThrow(ConflictError);

    expect(mockFuelTypeRepository.findById).toHaveBeenCalledWith(id);
    expect(mockVehicleRepository.findByFuelTypeId).toHaveBeenCalledWith(id);
    expect(mockVehicleRepository.delete).not.toHaveBeenCalled();
  });
});
