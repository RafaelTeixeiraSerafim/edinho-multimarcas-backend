import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ListFuelTypesUseCase } from "./ListFuelTypesUseCase";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

export class ListFuelTypesController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = request.query as PaginationQueryDTO;

    try {
      const listFuelTypesUseCase = container.resolve(ListFuelTypesUseCase);
      const fuelTypes = await listFuelTypesUseCase.execute(page, pageSize);
      return response.status(200).json({ fuelTypes });
    } catch (error) {
      next(error)
    }
  }
}
