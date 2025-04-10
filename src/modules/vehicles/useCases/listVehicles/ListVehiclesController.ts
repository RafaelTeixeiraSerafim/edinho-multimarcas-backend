import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ListVehiclesUseCase } from "./ListVehiclesUseCase";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

export class ListVehiclesController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { page = 0, pageSize = 10 } = request.query as PaginationQueryDTO;

    try {
      const listVehiclesUseCase = container.resolve(ListVehiclesUseCase);
      const vehicles = await listVehiclesUseCase.execute(page, pageSize);
      return response.status(200).json({ vehicles });
    } catch (error) {
      next(error);
    }
  }
}
