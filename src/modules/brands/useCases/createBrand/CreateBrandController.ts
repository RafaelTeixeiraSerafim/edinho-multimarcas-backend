import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateBrandUseCase } from "./CreateBrandUseCase";

export class CreateBrandController {
  async handle(request: Request, response: Response) {
    const data = request.body;
    const createdById = request.user?.id;
    if (!createdById)
      return response.status(401).json({ error: "user not authenticated" });

    try {
      const createBrandUseCase = container.resolve(CreateBrandUseCase);
      const createdBrand = await createBrandUseCase.execute(data, createdById);
      return response.status(201).json(createdBrand);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
