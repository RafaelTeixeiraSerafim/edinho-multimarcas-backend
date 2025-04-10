import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ListModelsUseCase } from "./ListModelsUseCase";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

export class ListModelsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { page = 0, pageSize = 10 } = request.query as PaginationQueryDTO;

    try {
      const listModelsUseCase = container.resolve(ListModelsUseCase);
      const models = await listModelsUseCase.execute(page, pageSize);
      return response.status(200).json({ models });
    } catch (error) {
      next(error);
    }
  }
}
