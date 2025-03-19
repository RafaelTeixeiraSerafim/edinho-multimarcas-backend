import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteFuelTypeUseCase } from "./DeleteFuelTypeUseCase";

export class DeleteFuelTypeController {
  async handle(request: Request, response: Response) {
    const fuelTypeId = request.params.id;
    const deletedById = request.user?.id;
    if (!deletedById)
      return response.status(401).json({ message: "user not authenticated" });

    try {
      const deleteFuelTypeUseCase = container.resolve(DeleteFuelTypeUseCase);
      await deleteFuelTypeUseCase.execute(fuelTypeId, deletedById);
      return response.status(204).json({});
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
