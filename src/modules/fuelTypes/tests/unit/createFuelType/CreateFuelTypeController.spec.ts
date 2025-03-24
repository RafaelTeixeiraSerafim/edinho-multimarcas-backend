import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@shared/infra/http/errors";
import { container } from "tsyringe";
import { CreateFuelTypeController } from "@modules/fuelTypes/useCases/createFuelType/CreateFuelTypeController";

// Mock the CreateFuelTypeUseCase
jest.mock("@modules/fuelTypes/useCases/createFuelType/CreateFuelTypeUseCase");

describe("CreateFuelTypeController", () => {
  let createFuelTypeController: CreateFuelTypeController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  // Mock the container.resolve method
  const mockResolve = jest.fn();
  beforeEach(() => {
    // Create an instance of the controller
    createFuelTypeController = new CreateFuelTypeController();

    // Mock the request, response, and next function
    mockRequest = {
      body: { name: "Gasoline", abbreviation: "G" },
      user: {
        id: "user-123", // Authenticated user ID
        name: "John Doe",
        email: "john.doe@example.com",
        password: "hashedPassword123",
        refreshToken: "refreshToken123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isDeleted: false,
        createdById: null,
        updatedById: null,
        deletedById: null,
        birthdate: null,
        contact: null,
        nationalId: null,
      }, // Simulate an authenticated user
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(), // Mock the status method
      json: jest.fn(), // Mock the json method
    };
    mockNext = jest.fn(); // Mock the next function

    // Mock the container.resolve method
    jest.spyOn(container, "resolve").mockImplementation(mockResolve);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return 201 and the created fuel type if the user is authenticated", async () => {
    // Arrange
    const mockFuelType = {
      id: "fuel-type-123",
      name: "Gasoline",
      abbreviation: "GAS",
      createdById: "user-123",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      isDeleted: false,
      updatedById: null,
      deletedById: null,
    };

    // Mock the use case to return the created fuel type
    const mockCreateFuelTypeUseCase = {
      execute: jest.fn().mockResolvedValue(mockFuelType),
    };
    mockResolve.mockReturnValue(mockCreateFuelTypeUseCase);

    // Act
    await createFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockCreateFuelTypeUseCase.execute).toHaveBeenCalledWith(
      mockRequest.body,
      mockRequest.user?.id
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockFuelType);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next with an UnauthorizedError if the user is not authenticated", async () => {
    // Arrange
    mockRequest.user = undefined; // Simulate an unauthenticated user

    // Act
    await createFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("should call next with an error if the use case throws an error", async () => {
    // Arrange
    const mockError = new Error("Some error");

    // Mock the use case to throw an error
    const mockCreateFuelTypeUseCase = {
      execute: jest.fn().mockRejectedValue(mockError),
    };
    mockResolve.mockReturnValue(mockCreateFuelTypeUseCase);

    // Act
    await createFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockCreateFuelTypeUseCase.execute).toHaveBeenCalledWith(
      mockRequest.body,
      mockRequest.user?.id
    );
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});