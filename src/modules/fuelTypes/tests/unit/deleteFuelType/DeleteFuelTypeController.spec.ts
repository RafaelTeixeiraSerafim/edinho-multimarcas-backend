import "reflect-metadata"
import { DeleteFuelTypeController } from "@modules/fuelTypes/useCases/deleteFuelType/DeleteFuelTypeController";
import { UnauthorizedError } from "@shared/infra/http/errors";
import { Request, Response } from "express";
import { container } from "tsyringe";

jest.mock("@modules/fuelTypes/useCases/deleteFuelType/DeleteFuelTypeUseCase");

describe("DeleteFuelTypeController", () => {
  let deleteFuelTypeController: DeleteFuelTypeController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  const mockResolve = jest.fn();
  beforeEach(() => {
    deleteFuelTypeController = new DeleteFuelTypeController();

    mockRequest = {
      params: { id: "fuel-type-123" },
      user: {
        id: "user-123",
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
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    jest.spyOn(container, "resolve").mockImplementation(mockResolve);

    jest.clearAllMocks();
  });

  it("deve retornar status 204 se o usuário estiver autenticado", async () => {
    const fuelTypeId = mockRequest.params?.id;
    const deletedById = mockRequest.user?.id;

    const mockDeleteFuelTypeUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };
    mockResolve.mockReturnValue(mockDeleteFuelTypeUseCase);

    await deleteFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockDeleteFuelTypeUseCase.execute).toHaveBeenCalledWith(fuelTypeId, deletedById)
    expect(mockResponse.status).toHaveBeenCalledWith(204)
    expect(mockResponse.json).toHaveBeenCalledWith({})
    expect(mockNext).not.toHaveBeenCalled()
  });

  it("deve mandar um UnauthorizedError se o usuário estiver autenticado", async () => {
    mockRequest.user = undefined

    await deleteFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError))
  });

  it("deve chamar next com o erro se o use case mandar um erro", async () => {
    // Arrange
    const mockError = new Error("Some error");

    // Mock the use case to throw an error
    const mockCreateFuelTypeUseCase = {
      execute: jest.fn().mockRejectedValue(mockError),
    };
    mockResolve.mockReturnValue(mockCreateFuelTypeUseCase);

    // Act
    await deleteFuelTypeController.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockCreateFuelTypeUseCase.execute).toHaveBeenCalledWith(
      mockRequest.params?.id,
      mockRequest.user?.id
    );
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
