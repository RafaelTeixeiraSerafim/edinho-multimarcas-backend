import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateFuelTypeUseCase } from "./CreateFuelTypeUseCase";

export class CreateFuelTypeController {
  async handle(request: Request, response: Response) {
    const data = request.body;
    const createdById = request.user?.id;
    if (!createdById)
      return response.status(401).json({ message: "user not authenticated" });

    try {
      const createFuelTypeUseCase = container.resolve(CreateFuelTypeUseCase);
      const createdFuelType = await createFuelTypeUseCase.execute(
        data,
        createdById
      );
      return response.status(201).json(createdFuelType);
    } catch (error: any) {
      return response.status(400).json({ message: error.message });
    }
  }
}
