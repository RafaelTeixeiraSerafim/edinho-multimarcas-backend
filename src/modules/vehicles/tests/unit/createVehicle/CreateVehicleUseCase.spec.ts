import "reflect-metadata";
import { CreateVehicleUseCase } from "@modules/vehicles/useCases/createVehicle/CreateVehicleUseCase";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { IFuelTypeRepository } from "@modules/fuelTypes/repositories/IFuelTypeRepository";
import { CreateVehicleDTO } from "@modules/vehicles/dtos/CreateVehicleDTO";
import { ConflictError, NotFoundError } from "@shared/infra/http/errors";

describe("CreateVehicleUseCase", () => {
  let createVehicleUseCase: CreateVehicleUseCase;
  let mockVehicleRepository: jest.Mocked<IVehicleRepository>;
  let mockModelRepository: jest.Mocked<IModelRepository>;
  let mockFuelTypeRepository: jest.Mocked<IFuelTypeRepository>;

  // Helper functions
  const createMockVehicleDTO = (overrides: Partial<CreateVehicleDTO> = {}): CreateVehicleDTO => ({
    fipeCode: "123456",
    value: 50000,
    referenceMonth: new Date().getMonth() + 1,
    referenceYear: new Date().getFullYear(),
    vehicleYear: 2023,
    modelId: "modelo-id",
    fuelTypeId: "combustivel-id",
    ...overrides,
  });

  const createMockVehicle = (overrides: any = {}) => ({
    id: "veiculo-id",
    fipeCode: "123456",
    value: 50000,
    referenceMonth: 6,
    referenceYear: 2023,
    vehicleYear: 2023,
    modelId: "modelo-id",
    fuelTypeId: "combustivel-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: false,
    createdById: "usuario-id",
    updatedById: null,
    deletedById: null,
    ...overrides,
  });

  const createMockModel = (overrides: any = {}) => ({
    id: "modelo-id",
    brandId: "brand-id",
    createdAt: new Date(),
    createdById: "user-id",
    deletedAt: null,
    deletedById: "user-id",
    fipeCode: null,
    isDeleted: false,
    name: "brand",
    updatedAt: new Date(),
    updatedById: null,
    ...overrides,
  });

  const createMockFuelType = (overrides: any = {}) => ({
    id: "combustivel-id",
    createdAt: new Date(),
    createdById: "user-id",
    deletedAt: null,
    deletedById: "user-id",
    isDeleted: false,
    name: "Gasolina",
    updatedAt: new Date(),
    updatedById: null,
    abbreviation: "G",
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockVehicleRepository = {
      create: jest.fn(),
      findExistingVehicle: jest.fn(),
    } as any;

    mockModelRepository = {
      findById: jest.fn(),
    } as any;

    mockFuelTypeRepository = {
      findById: jest.fn(),
    } as any;

    createVehicleUseCase = new CreateVehicleUseCase(
      mockVehicleRepository,
      mockModelRepository,
      mockFuelTypeRepository
    );
  });

  it("deve criar um novo veículo com sucesso", async () => {
    const mockData = createMockVehicleDTO();
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockModelRepository.findById.mockResolvedValue(createMockModel());
    mockFuelTypeRepository.findById.mockResolvedValue(createMockFuelType());
    mockVehicleRepository.create.mockResolvedValue(createMockVehicle());

    const result = await createVehicleUseCase.execute(mockData, "usuario-id");

    expect(mockVehicleRepository.findExistingVehicle).toHaveBeenCalledWith(mockData);
    expect(mockModelRepository.findById).toHaveBeenCalledWith("modelo-id");
    expect(mockFuelTypeRepository.findById).toHaveBeenCalledWith("combustivel-id");
    expect(mockVehicleRepository.create).toHaveBeenCalledWith(mockData, "usuario-id");
    expect(result.value).toBe(50000);
    expect(result.modelId).toBe("modelo-id");
  });

  it("deve lançar erro quando veículo com mesmos dados já existe", async () => {
    const mockData = createMockVehicleDTO();
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(createMockVehicle());

    await expect(
      createVehicleUseCase.execute(mockData, "usuario-id")
    ).rejects.toThrow(ConflictError);

    expect(mockVehicleRepository.create).not.toHaveBeenCalled();
  });

  it("deve lançar erro quando modelo não existe", async () => {
    const mockData = createMockVehicleDTO({ modelId: "modelo-inexistente" });
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockModelRepository.findById.mockResolvedValue(null);

    await expect(
      createVehicleUseCase.execute(mockData, "usuario-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve lançar erro quando tipo de combustível não existe", async () => {
    const mockData = createMockVehicleDTO({ fuelTypeId: "combustivel-inexistente" });
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockModelRepository.findById.mockResolvedValue(createMockModel());
    mockFuelTypeRepository.findById.mockResolvedValue(null);

    await expect(
      createVehicleUseCase.execute(mockData, "usuario-id")
    ).rejects.toThrow(NotFoundError);
  });

  it("deve usar valores padrão para mês e ano de referência quando não fornecidos", async () => {
    const currentDate = new Date();
    const mockData = createMockVehicleDTO({
      referenceMonth: undefined,
      referenceYear: undefined,
    });
    
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockModelRepository.findById.mockResolvedValue(createMockModel());
    mockFuelTypeRepository.findById.mockResolvedValue(createMockFuelType());
    mockVehicleRepository.create.mockResolvedValue(
      createMockVehicle({
        referenceMonth: currentDate.getMonth() + 1,
        referenceYear: currentDate.getFullYear(),
      })
    );

    const result = await createVehicleUseCase.execute(mockData, "usuario-id");

    expect(result.referenceMonth).toBe(currentDate.getMonth() + 1);
    expect(result.referenceYear).toBe(currentDate.getFullYear());
  });

  it("deve incluir createdBy no registro criado", async () => {
    const mockData = createMockVehicleDTO();
    const specificUserId = "usuario-especifico";
    
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockModelRepository.findById.mockResolvedValue(createMockModel());
    mockFuelTypeRepository.findById.mockResolvedValue(createMockFuelType());
    mockVehicleRepository.create.mockResolvedValue(
      createMockVehicle({ createdById: specificUserId })
    );

    const result = await createVehicleUseCase.execute(mockData, specificUserId);

    expect(result.createdById).toBe(specificUserId);
  });

  it("deve validar campos obrigatórios", async () => {
    const mockData = createMockVehicleDTO();
    mockVehicleRepository.findExistingVehicle.mockResolvedValue(null);
    mockModelRepository.findById.mockResolvedValue(createMockModel());
    mockFuelTypeRepository.findById.mockResolvedValue(createMockFuelType());
    mockVehicleRepository.create.mockResolvedValue(createMockVehicle());

    const result = await createVehicleUseCase.execute(mockData, "usuario-id");

    expect(result.value).toBeDefined();
    expect(result.vehicleYear).toBeDefined();
    expect(result.modelId).toBeDefined();
    expect(result.fuelTypeId).toBeDefined();
  });
});