import "reflect-metadata";
import { UpdateVehicleUseCase } from "@modules/vehicles/useCases/updateVehicle/UpdateVehicleUseCase";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { IFuelTypeRepository } from "@modules/fuelTypes/repositories/IFuelTypeRepository";
import { UpdateVehicleDTO } from "@modules/vehicles/dtos/UpdateVehicleDTO";
import {
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from "@shared/infra/http/errors";
import { IModel } from "@modules/models/interfaces/IModel";
import { IFuelType } from "@modules/fuelTypes/interfaces/IFuelType";

describe("UpdateVehicleUseCase", () => {
  let updateVehicleUseCase: UpdateVehicleUseCase;
  let mockVehicleRepository: jest.Mocked<IVehicleRepository>;
  let mockModelRepository: jest.Mocked<IModelRepository>;
  let mockFuelTypeRepository: jest.Mocked<IFuelTypeRepository>;

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

  const createValidUpdateDTO = (overrides: any = {}): UpdateVehicleDTO => ({
    value: 55000,
    vehicleYear: 2022,
    modelId: "valid-model-id",
    fuelTypeId: "valid-fuel-type-id",
    ...overrides,
  });

  const createModel = (): IModel => ({
    id: "model-id",
    brandId: "brand-id",
    name: "model",
    fipeCode: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: "user-id",
    deletedAt: null,
    deletedById: null,
    isDeleted: false,
    updatedById: null,
  });

  const createFuelType = (): IFuelType => ({
    id: "model-id",
    abbreviation: "G",
    name: "Gasolina",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: "user-id",
    deletedAt: null,
    deletedById: null,
    isDeleted: false,
    updatedById: null,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockVehicleRepository = {
      findById: jest.fn(),
      findExistingVehicle: jest.fn(),
      update: jest.fn(),
    } as any;

    mockModelRepository = {
      findById: jest.fn(),
    } as any;

    mockFuelTypeRepository = {
      findById: jest.fn(),
    } as any;

    updateVehicleUseCase = new UpdateVehicleUseCase(
      mockVehicleRepository,
      mockModelRepository,
      mockFuelTypeRepository
    );
  });

  it("deve atualizar um veículo com sucesso", async () => {
    const mockVehicle = createMockVehicle();
    const updateData = createValidUpdateDTO();

    mockModelRepository.findById.mockResolvedValue(createModel());
    mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockVehicleRepository.update.mockResolvedValue({
      ...mockVehicle,
      ...updateData,
    });
    mockFuelTypeRepository.findById.mockResolvedValue(createFuelType());

    const result = await updateVehicleUseCase.execute(
      "vehicle-id",
      updateData,
      "user-id"
    );

    expect(mockVehicleRepository.findById).toHaveBeenCalledWith("vehicle-id");
    expect(mockVehicleRepository.update).toHaveBeenCalledWith(
      "vehicle-id",
      updateData,
      "user-id"
    );
    expect(result.value).toBe(55000);
  });

  it("deve lançar erro quando veículo não existe", async () => {
    mockVehicleRepository.findById.mockResolvedValue(null);

    await expect(
      updateVehicleUseCase.execute(
        "non-existent-id",
        createValidUpdateDTO(),
        "user-id"
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar erro quando veículo com mesmos dados já existe", async () => {
    const mockVehicle = createMockVehicle();
    const conflictingVehicle = createMockVehicle({ id: "other-id" });

    mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(
      conflictingVehicle
    );

    await expect(
      updateVehicleUseCase.execute(
        "vehicle-id",
        createValidUpdateDTO(),
        "user-id"
      )
    ).rejects.toThrow(ConflictError);
  });

  it("deve lançar erro quando modelo não existe", async () => {
    const mockVehicle = createMockVehicle();
    const updateData = createValidUpdateDTO();

    mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockModelRepository.findById.mockResolvedValue(null);

    await expect(
      updateVehicleUseCase.execute("vehicle-id", updateData, "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar erro quando tipo de combustível não existe", async () => {
    const mockVehicle = createMockVehicle();
    const mockModel = createModel();
    const updateData = createValidUpdateDTO();

    mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockModelRepository.findById.mockResolvedValue(mockModel);
    mockFuelTypeRepository.findById.mockResolvedValue(null);

    await expect(
      updateVehicleUseCase.execute("vehicle-id", updateData, "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar erro quando tenta atualizar valor de veículo com código FIPE", async () => {
    const mockVehicle = createMockVehicle({ fipeCode: "123456" });
    const updateData = createValidUpdateDTO();

    mockModelRepository.findById.mockResolvedValue(createModel());
    mockFuelTypeRepository.findById.mockResolvedValue(createFuelType());
    mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);

    await expect(
      updateVehicleUseCase.execute("vehicle-id", updateData, "user-id")
    ).rejects.toThrow(ForbiddenError);
  });

  it("deve permitir atualização de outros campos em veículo com código FIPE", async () => {
    const mockVehicle = createMockVehicle({ fipeCode: "123456" });
    const updateData = createValidUpdateDTO({ value: 0 });

    mockModelRepository.findById.mockResolvedValue(createModel());
    mockFuelTypeRepository.findById.mockResolvedValue(createFuelType());
    mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockVehicleRepository.update.mockResolvedValue({
      ...mockVehicle,
      ...updateData,
    });

    const result = await updateVehicleUseCase.execute(
      "vehicle-id",
      updateData,
      "user-id"
    );

    expect(result.referenceYear).toBe(2023);
  });

  it("deve incluir updatedBy na atualização", async () => {
    const mockVehicle = createMockVehicle();
    const updateData = createValidUpdateDTO();
    const specificUserId = "specific-user-id";

    mockModelRepository.findById.mockResolvedValue(createModel());
    mockFuelTypeRepository.findById.mockResolvedValue(createFuelType());
    mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockVehicleRepository.update.mockResolvedValue({
      ...mockVehicle,
      ...updateData,
      updatedById: specificUserId,
    });

    await updateVehicleUseCase.execute(
      "vehicle-id",
      updateData,
      specificUserId
    );

    expect(mockVehicleRepository.update).toHaveBeenCalledWith(
      "vehicle-id",
      updateData,
      specificUserId
    );
  });
});
