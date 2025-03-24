import "reflect-metadata";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { DeleteModelUseCase } from "@modules/models/useCases/deleteModel/DeleteModelUseCase";

describe("DeleteModelUseCase", () => {
  let deleteModelUseCase: DeleteModelUseCase;
  let mockModelRepository: jest.Mocked<IModelRepository>;
  let mockVehicleRepository: jest.Mocked<IVehicleRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockModelRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
      // Add other methods as needed
    } as any;

    mockVehicleRepository = {
      findByModelId: jest.fn(),
      delete: jest.fn(),
      // Add other methods as needed
    } as any;

    deleteModelUseCase = new DeleteModelUseCase(
      mockModelRepository,
      mockVehicleRepository
    );
  });

  // Helper to create mock model
  const createMockModel = (overrides: any = {}) => ({
    id: "model-id",
    name: "Test Model",
    isDeleted: false,
    ...overrides,
  });

  // Helper to create mock vehicle
  const createMockVehicle = (overrides: any = {}) => ({
    id: "vehicle-id",
    modelId: "model-id",
    ...overrides,
  });

  it("deve deletar um modelo e seus veículos com sucesso", async () => {
    const mockModel = createMockModel();
    const mockVehicles = [createMockVehicle(), createMockVehicle({ id: "vehicle-id-2" })];

    mockModelRepository.findById.mockResolvedValue(mockModel);
    mockVehicleRepository.findByModelId.mockResolvedValue(mockVehicles);

    await deleteModelUseCase.execute("model-id", "user-id");

    expect(mockModelRepository.findById).toHaveBeenCalledWith("model-id");
    expect(mockVehicleRepository.findByModelId).toHaveBeenCalledWith("model-id");
    expect(mockVehicleRepository.delete).toHaveBeenCalledTimes(2);
    expect(mockModelRepository.delete).toHaveBeenCalledWith("model-id", "user-id");
  });

  it("deve lançar erro quando modelo não existe", async () => {
    mockModelRepository.findById.mockResolvedValue(null);

    await expect(
      deleteModelUseCase.execute("invalid-id", "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar erro quando modelo já está deletado", async () => {
    const deletedModel = createMockModel({ isDeleted: true });
    mockModelRepository.findById.mockResolvedValue(deletedModel);

    await expect(
      deleteModelUseCase.execute("model-id", "user-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve deletar modelo mesmo sem veículos associados", async () => {
    const mockModel = createMockModel();
    mockModelRepository.findById.mockResolvedValue(mockModel);
    mockVehicleRepository.findByModelId.mockResolvedValue([]);

    await deleteModelUseCase.execute("model-id", "user-id");

    expect(mockVehicleRepository.delete).not.toHaveBeenCalled();
    expect(mockModelRepository.delete).toHaveBeenCalled();
  });

  it("deve passar o deletedById corretamente para os veículos e modelo", async () => {
    const mockModel = createMockModel();
    const mockVehicles = [createMockVehicle()];
    const deletedById = "user-id-123";

    mockModelRepository.findById.mockResolvedValue(mockModel);
    mockVehicleRepository.findByModelId.mockResolvedValue(mockVehicles);

    await deleteModelUseCase.execute("model-id", deletedById);

    expect(mockVehicleRepository.delete).toHaveBeenCalledWith(
      "vehicle-id",
      deletedById
    );
    expect(mockModelRepository.delete).toHaveBeenCalledWith(
      "model-id",
      deletedById
    );
  });
});