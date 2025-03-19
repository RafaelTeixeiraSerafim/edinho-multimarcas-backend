import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListFuelTypesUseCase } from "./ListFuelTypesUseCase";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

export class ListFuelTypesController {
  async handle(request: Request, response: Response) {
    const { page = 1, pageSize = 10 } = request.query as PaginationQueryDTO;

    try {
      const listFuelTypesUseCase = container.resolve(ListFuelTypesUseCase);
      const fuelTypes = await listFuelTypesUseCase.execute(page, pageSize);
      return response.status(200).json({ fuelTypes });
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
