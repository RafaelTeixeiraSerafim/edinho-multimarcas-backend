import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ListBrandsUseCase } from "./ListBrandsUseCase";

export class ListBrandsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = request.query as PaginationQueryDTO;

    try {
      const listBrandsUseCase = container.resolve(ListBrandsUseCase);
      const brands = await listBrandsUseCase.execute(page, pageSize);
      return response.status(200).json({ brands });
    } catch (error) {
      next(error);
    }
  }
}
