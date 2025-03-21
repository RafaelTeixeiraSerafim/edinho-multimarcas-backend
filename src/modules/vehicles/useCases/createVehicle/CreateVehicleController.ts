import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { CreateVehicleUseCase } from "./CreateVehicleUseCase";
import { UnauthorizedError } from "@shared/infra/http/errors";
import { CreateVehicleDTO } from "@modules/vehicles/dtos/CreateVehicleDTO";

export class CreateVehicleController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const data: CreateVehicleDTO = request.body;
    const createdById = request.user?.id;

    try {
      if (!createdById) throw new UnauthorizedError("Usuário não autenticado");

      const currentDate = new Date();

      data.referenceMonth = data.referenceMonth ?? currentDate.getMonth() + 1;
      data.referenceYear = data.referenceYear ?? currentDate.getFullYear();

      const createVehicleUseCase = container.resolve(CreateVehicleUseCase);
      const createdVehicle = await createVehicleUseCase.execute(
        data,
        createdById
      );
      return response.status(201).json(createdVehicle);
    } catch (error) {
      next(error);
    }
  }
}
