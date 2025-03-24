import "reflect-metadata";
import { DeleteVehicleUseCase } from "@modules/vehicles/useCases/deleteVehicle/DeleteVehicleUseCase";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { NotFoundError, ForbiddenError } from "@shared/infra/http/errors";

describe("DeleteVehicleUseCase", () => {
  let deleteVehicleUseCase: DeleteVehicleUseCase;
  let mockVehicleRepository: jest.Mocked<IVehicleRepository>;

  // Helper function to create mock vehicle
  const createMockVehicle = (overrides: any = {}) => ({
    id: "vehicle-id",
    fipeCode: null,
    value: 50000,
    referenceMonth: 6,
    referenceYear: 2023,
    vehicleYear: 2023,
    modelId: "model-id",
    fuelTypeId: "fuel-type-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: false,
    createdById: "user-id",
    updatedById: null,
    deletedById: null,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockVehicleRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
      // Add other repository methods as needed
    } as any;

    deleteVehicleUseCase = new DeleteVehicleUseCase(mockVehicleRepository);
  });

  it("deve deletar um veículo com sucesso", async () => {
    const mockVehicle = createMockVehicle();
    mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

    await deleteVehicleUseCase.execute("vehicle-id", "user-id");

    expect(mockVehicleRepository.findById).toHaveBeenCalledWith("vehicle-id");
    expect(mockVehicleRepository.delete).toHaveBeenCalledWith("vehicle-id", "user-id");
  });

  it("deve lançar erro quando veículo não existe", async () => {
    mockVehicleRepository.findById.mockResolvedValue(null);

    await expect(
      deleteVehicleUseCase.execute("non-existent-id", "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar erro quando veículo possui código FIPE", async () => {
    const vehicleWithFipe = createMockVehicle({ fipeCode: "123456" });
    mockVehicleRepository.findById.mockResolvedValue(vehicleWithFipe);

    await expect(
      deleteVehicleUseCase.execute("vehicle-with-fipe", "user-id")
    ).rejects.toThrow(ForbiddenError);
  });

  it("deve incluir deletedBy no registro deletado", async () => {
    const mockVehicle = createMockVehicle();
    const specificUserId = "specific-user-id";
    mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

    await deleteVehicleUseCase.execute("vehicle-id", specificUserId);

    expect(mockVehicleRepository.delete).toHaveBeenCalledWith(
      "vehicle-id",
      specificUserId
    );
  });

  it("não deve deletar quando ocorrer erro de permissão", async () => {
    const vehicleWithFipe = createMockVehicle({ fipeCode: "123456" });
    mockVehicleRepository.findById.mockResolvedValue(vehicleWithFipe);

    try {
      await deleteVehicleUseCase.execute("vehicle-with-fipe", "user-id");
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
    }

    expect(mockVehicleRepository.delete).not.toHaveBeenCalled();
  });

  it("não deve deletar quando veículo não existe", async () => {
    mockVehicleRepository.findById.mockResolvedValue(null);

    try {
      await deleteVehicleUseCase.execute("non-existent-id", "user-id");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }

    expect(mockVehicleRepository.delete).not.toHaveBeenCalled();
  });
});