import "reflect-metadata";
import { ListFuelTypesController } from "@modules/fuelTypes/useCases/listFuelTypes/ListFuelTypesController";
import { ListFuelTypesUseCase } from "@modules/fuelTypes/useCases/listFuelTypes/ListFuelTypesUseCase";
import { NextFunction, Request, Response } from "express";

// Mock the ListFuelTypesUseCase
jest.mock("@modules/fuelTypes/useCases/listFuelTypes/ListFuelTypesUseCase");

describe("ListFuelTypesController", () => {
  let listFuelTypesController: ListFuelTypesController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods
    jest.clearAllMocks();

    // Initialize the controller
    listFuelTypesController = new ListFuelTypesController();

    // Mock request, response, and next function
    mockRequest = {
      query: {
        page: 1, // Already transformed to a number by the DTO
        pageSize: 10, // Already transformed to a number by the DTO
      } as any,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("deve retornar uma lista de tipos de combustível com status 200", async () => {
    // Mock the execute method of ListFuelTypesUseCase
    const mockFuelTypes = [
      { id: "1", name: "Gasoline", abbreviation: "GAS" },
      { id: "2", name: "Diesel", abbreviation: "DSL" },
    ];

    const mockExecute = jest.fn().mockResolvedValue(mockFuelTypes);
    (ListFuelTypesUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    // Call the handle method
    await listFuelTypesController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assertions
    expect(mockExecute).toHaveBeenCalledWith(1, 10); // Ensure numbers are passed
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      fuelTypes: mockFuelTypes,
    });
  });

  it("deve chamar next com o erro se o use case mandar um erro", async () => {
    // Mock the execute method of ListFuelTypesUseCase to throw an error
    const mockError = new Error("Test error");
    const mockExecute = jest.fn().mockRejectedValue(mockError);
    (ListFuelTypesUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    // Call the handle method
    await listFuelTypesController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assertions
    expect(mockExecute).toHaveBeenCalledWith(1, 10); // Ensure numbers are passed
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
