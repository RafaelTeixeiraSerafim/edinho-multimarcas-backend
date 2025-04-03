import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { GetVehiclesByModelIdUseCase } from "./GetVehiclesByModelIdUseCase";

export class GetVehiclesByModelIdController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const modelId = request.params.modelId

    try {
      const getVehiclesByModelIdUseCase = container.resolve(GetVehiclesByModelIdUseCase);
      const vehicles = await getVehiclesByModelIdUseCase.execute(modelId);
      return response.status(200).json({ vehicles });
    } catch (error) {
      next(error);
    }
  }
}
