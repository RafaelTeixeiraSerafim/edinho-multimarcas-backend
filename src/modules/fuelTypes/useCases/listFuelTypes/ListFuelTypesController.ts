import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ListFuelTypesUseCase } from "./ListFuelTypesUseCase";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

export class ListFuelTypesController {
  async handle(request: Request, response: Response, next: NextFunction) {
    let params = request.query as PaginationQueryDTO;

    if (
      !["abbreviation", "name", "createdAt"].includes(params.orderByField || "")
    )
      params.orderByField = "createdAt";

    try {
      const listFuelTypesUseCase = container.resolve(ListFuelTypesUseCase);
      const fuelTypes = await listFuelTypesUseCase.execute(params);
      return response.status(200).json(fuelTypes);
    } catch (error) {
      next(error);
    }
  }
}
