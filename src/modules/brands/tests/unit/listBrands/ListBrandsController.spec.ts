import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ListBrandsController } from "@modules/brands/useCases/listBrands/ListBrandsController";
import { ListBrandsUseCase } from "@modules/brands/useCases/listBrands/ListBrandsUseCase";

// Mock the use case with proper module path
jest.mock("@modules/brands/useCases/listBrands/ListBrandsUseCase");

describe("ListBrandsController", () => {
  let listBrandsController: ListBrandsController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();
    listBrandsController = new ListBrandsController();

    mockRequest = {
      query: {
        page: 1,
        pageSize: 10,
      } as any,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("deve listar marcas com sucesso e retornar status 200", async () => {
    const mockBrands = [
      { id: "brand-1", name: "Brand 1" },
      { id: "brand-2", name: "Brand 2" },
    ];

    const mockExecute = jest.fn().mockResolvedValue(mockBrands);
    (ListBrandsUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await listBrandsController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ brands: mockBrands });
  });

  it("deve usar valores padrão quando query params não são fornecidos", async () => {
    mockRequest.query = {};
    const mockBrands = [{ id: "brand-1", name: "Brand 1" }];

    const mockExecute = jest.fn().mockResolvedValue(mockBrands);
    (ListBrandsUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await listBrandsController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockExecute).toHaveBeenCalledWith(1, 10);
  });

  it("deve chamar next com erro quando use case lançar exceção", async () => {
    const mockError = new Error("Test error");
    const mockExecute = jest.fn().mockRejectedValue(mockError);
    (ListBrandsUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    await listBrandsController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});