import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteFuelTypeUseCase } from "./DeleteFuelTypeUseCase";
import { UnauthorizedError } from "@shared/infra/http/errors";

export class DeleteFuelTypeController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const fuelTypeId = request.params.id;
    const deletedById = request.user?.id;

    try {
      if (!deletedById) throw new UnauthorizedError("Usuário não autenticado");

      const deleteFuelTypeUseCase = container.resolve(DeleteFuelTypeUseCase);
      await deleteFuelTypeUseCase.execute(fuelTypeId, deletedById);
      return response.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
