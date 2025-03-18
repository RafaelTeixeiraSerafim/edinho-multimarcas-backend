import { CreateVehicleDTO } from "@modules/vehicles/dtos/CreateVehicleDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateVehicleUseCase } from "./CreateVehicleUseCase";

export class CreateVehicleController {
  async handle(request: Request, response: Response): Promise<Response> {
    const data: CreateVehicleDTO = request.body;

    const currentDate = new Date();

    data.referenceYear = data.referenceYear ?? currentDate.getFullYear();
    data.referenceMonth = data.referenceMonth ?? currentDate.getMonth() + 1;

    const createVehicleUseCase = container.resolve(CreateVehicleUseCase);

    const createdVehicle = await createVehicleUseCase.execute(data);

    return response.status(201).json(createdVehicle);
  }
}
