import { UnauthorizedError, ValidationError } from "@shared/infra/http/errors";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateFuelTypeUseCase } from "./UpdateFuelTypeUseCase";

export class UpdateFuelTypeController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const fuelTypeId = request.params.id;
    const data = request.body;
    const updatedById = request.user?.id;

    try {
      if (!updatedById) throw new UnauthorizedError("user not authenticated");
      if (!Object.keys(data).length)
        throw new ValidationError("request body cannot be empty");

      const updateFuelTypeUseCase = container.resolve(UpdateFuelTypeUseCase);
      const updatedFuelType = await updateFuelTypeUseCase.execute(
        fuelTypeId,
        data,
        updatedById
      );
      return response.status(200).json(updatedFuelType);
    } catch (error) {
      next(error);
    }
  }
}
