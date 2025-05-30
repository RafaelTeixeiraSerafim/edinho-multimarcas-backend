import { UpdateVehicleDTO } from "@modules/vehicles/dtos/UpdateVehicleDTO";
import { UnauthorizedError, BadRequestError } from "@shared/infra/http/errors";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateVehicleUseCase } from "./UpdateVehicleUseCase";

export class UpdateVehicleController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const vehicleId = request.params.id;
    const data: UpdateVehicleDTO = request.body;
    const updatedById = request.user?.id;

    try {
      if (!updatedById) throw new UnauthorizedError("Usuário não autenticado");
      if (!Object.keys(data).length)
        throw new BadRequestError("Corpo da requisição não pode estar vazio");

      const updateVehicleUseCase = container.resolve(UpdateVehicleUseCase);
      const updatedVehicle = await updateVehicleUseCase.execute(
        vehicleId,
        data,
        updatedById
      );
      return response.status(200).json(updatedVehicle);
    } catch (error) {
      next(error);
    }
  }
}
