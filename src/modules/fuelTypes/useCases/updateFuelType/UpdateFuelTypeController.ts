import { UnauthorizedError, BadRequestError } from "@shared/infra/http/errors";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateFuelTypeUseCase } from "./UpdateFuelTypeUseCase";

export class UpdateFuelTypeController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const fuelTypeId = request.params.id;
    const data = request.body;
    const updatedById = request.user?.id;

    try {
      if (!updatedById) throw new UnauthorizedError("Usuário não autenticado");
      if (!Object.keys(data).length)
        throw new BadRequestError("Corpo da requisição não pode estar vazio");

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
