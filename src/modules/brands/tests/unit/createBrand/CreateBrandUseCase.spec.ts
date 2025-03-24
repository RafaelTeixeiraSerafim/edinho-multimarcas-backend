import "reflect-metadata"
import { IBrand } from "@modules/brands/interfaces/IBrand";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { CreateBrandUseCase } from "@modules/brands/useCases/createBrand/CreateBrandUseCase";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { CreateBrandDTO } from "@modules/brands/dtos/CreateBrandDTO";

// Mock do repositório
const mockBrandRepository: jest.Mocked<IBrandRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  list: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
};

describe("CreateBrandUseCase", () => {
  let createBrandUseCase: CreateBrandUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createBrandUseCase = new CreateBrandUseCase(mockBrandRepository);
  });

  // Helper para criar mock de marca
  const createMockBrand = (overrides: Partial<IBrand> = {}) => ({
    id: "marca-id",
    name: "Marca Teste",
    fipeCode: "123",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: false,
    createdById: "usuario-id",
    updatedById: null,
    deletedById: null,
    ...overrides,
  });

  it("deve criar uma nova marca com sucesso", async () => {
    const mockData: CreateBrandDTO = {
      name: "Nova Marca",
      fipeCode: "1234",
    };

    mockBrandRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.create.mockResolvedValue(createMockBrand(mockData));

    const result = await createBrandUseCase.execute(mockData, "usuario-id");

    expect(mockBrandRepository.findByName).toHaveBeenCalledWith("Nova Marca");
    expect(mockBrandRepository.create).toHaveBeenCalledWith(mockData, "usuario-id");
    expect(result.name).toBe("Nova Marca");
    expect(result.fipeCode).toBe("1234");
  });

  it("deve criar marca sem código fipe quando não fornecido", async () => {
    const mockData: CreateBrandDTO = {
      name: "Marca Sem Fipe",
    };

    mockBrandRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.create.mockResolvedValue(createMockBrand({ 
      ...mockData, 
      fipeCode: undefined 
    }));

    const result = await createBrandUseCase.execute(mockData, "usuario-id");

    expect(result.name).toBe("Marca Sem Fipe");
    expect(result.fipeCode).toBeUndefined();
  });

  it("deve lançar erro quando marca com mesmo nome já existe", async () => {
    const mockData: CreateBrandDTO = {
      name: "Marca Existente",
    };

    mockBrandRepository.findByName.mockResolvedValue(createMockBrand());

    await expect(
      createBrandUseCase.execute(mockData, "usuario-id")
    ).rejects.toThrow(ConflictError);

    expect(mockBrandRepository.create).not.toHaveBeenCalled();
  });

  it("deve incluir createdBy no registro criado", async () => {
    const mockData: CreateBrandDTO = {
      name: "Marca com Criador",
    };

    mockBrandRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.create.mockResolvedValue(
      createMockBrand({ ...mockData, createdById: "usuario-especifico" })
    );

    const result = await createBrandUseCase.execute(mockData, "usuario-especifico");

    expect(result.createdById).toBe("usuario-especifico");
  });

  it("deve garantir que campos obrigatórios estão presentes", async () => {
    const mockData: CreateBrandDTO = {
      name: "Marca Válida",
    };

    mockBrandRepository.findByName.mockResolvedValue(null);
    mockBrandRepository.create.mockResolvedValue(createMockBrand(mockData));

    const result = await createBrandUseCase.execute(mockData, "usuario-id");

    expect(result.name).toBeDefined();
    expect(result.createdAt).toBeDefined();
    expect(result.id).toBeDefined();
  });
});