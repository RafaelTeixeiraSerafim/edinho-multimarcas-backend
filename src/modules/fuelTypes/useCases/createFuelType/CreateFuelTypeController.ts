import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { CreateFuelTypeUseCase } from "./CreateFuelTypeUseCase";
import { UnauthorizedError } from "@shared/infra/http/errors";

export class CreateFuelTypeController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const data = request.body;
    const createdById = request.user?.id;

    try {
      if (!createdById) throw new UnauthorizedError("user not authenticated");

      const createFuelTypeUseCase = container.resolve(CreateFuelTypeUseCase);
      const createdFuelType = await createFuelTypeUseCase.execute(
        data,
        createdById
      );
      return response.status(201).json(createdFuelType);
    } catch (error) {
      next(error);
    }
  }
}
