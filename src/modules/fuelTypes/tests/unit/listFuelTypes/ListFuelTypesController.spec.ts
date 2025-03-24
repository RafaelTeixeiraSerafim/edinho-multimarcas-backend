import "reflect-metadata";
import { ListFuelTypesController } from "@modules/fuelTypes/useCases/listFuelTypes/ListFuelTypesController";
import { ListFuelTypesUseCase } from "@modules/fuelTypes/useCases/listFuelTypes/ListFuelTypesUseCase";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

// Mock the ListFuelTypesUseCase and tsyringe container
jest.mock("@modules/fuelTypes/useCases/listFuelTypes/ListFuelTypesUseCase");

describe("ListFuelTypesController", () => {
  let controller: ListFuelTypesController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockUseCase: jest.Mocked<ListFuelTypesUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock the constructor
    (ListFuelTypesUseCase as jest.Mock).mockImplementation(() => mockUseCase);

    controller = new ListFuelTypesController();

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

  // Test 1: Success case with query params
  it("should return fuel types with status 200", async () => {
    const mockData = [
      {
        id: "1",
        name: "Gasoline",
        abbreviation: "G",
        createdById: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isDeleted: false,
        updatedById: null,
        deletedById: null,
      },
    ];
    mockRequest = { query: { page: 2, pageSize: 20 } as any };
    mockUseCase.execute.mockResolvedValue(mockData);

    await controller.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockUseCase.execute).toHaveBeenCalledWith(2, 20);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ fuelTypes: mockData });
  });

  // Test 2: Default pagination values
  it("should use default pagination when no query params", async () => {
    const mockData = [
      {
        id: "1",
        name: "Diesel",
        abbreviation: "D",
        createdById: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isDeleted: false,
        updatedById: null,
        deletedById: null,
      },
    ];
    mockUseCase.execute.mockResolvedValue(mockData);
    mockRequest = { query: {} }; // Empty query

    await controller.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockUseCase.execute).toHaveBeenCalledWith(1, 10); // Default values
  });

  // Test 3: Error handling
  it("should call next with error when use case throws", async () => {
    const mockError = new Error("Database error");
    mockUseCase.execute.mockRejectedValue(mockError);
    mockRequest = { query: { page: 1 } as any };

    await controller.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
