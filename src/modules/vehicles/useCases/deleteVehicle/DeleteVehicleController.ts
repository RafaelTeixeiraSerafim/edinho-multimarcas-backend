import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteVehicleUseCase } from "./DeleteVehicleUseCase";
import { UnauthorizedError } from "@shared/infra/http/errors";

export class DeleteVehicleController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const vehicleId = request.params.id;
    const deletedById = request.user?.id;

    try {
      if (!deletedById) throw new UnauthorizedError("Usuário não autenticado");

      const deleteVehicleUseCase = container.resolve(DeleteVehicleUseCase);
      await deleteVehicleUseCase.execute(vehicleId, deletedById);
      return response.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
