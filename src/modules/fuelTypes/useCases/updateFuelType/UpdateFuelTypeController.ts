import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateFuelTypeUseCase } from "./UpdateFuelTypeUseCase";

export class UpdateFuelTypeController {
  async handle(request: Request, response: Response) {
    const fuelTypeId = request.params.id;
    const data = request.body;
    const updatedById = request.user?.id;
    if (!updatedById)
      return response.status(401).json({ error: "user not authenticated" });

    try {
      const updateFuelTypeUseCase = container.resolve(UpdateFuelTypeUseCase);
      const updatedFuelType = await updateFuelTypeUseCase.execute(
        fuelTypeId,
        data,
        updatedById
      );
      return response.status(200).json(updatedFuelType);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
