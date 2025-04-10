import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ListBrandsUseCase } from "./ListBrandsUseCase";

export class ListBrandsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    let params = request.query as PaginationQueryDTO;

    if (!["fipeCode", "name", "createdAt"].includes(params.orderByField || ""))
      params.orderByField = "createdAt";

    try {
      const listBrandsUseCase = container.resolve(ListBrandsUseCase);
      const brands = await listBrandsUseCase.execute(params);
      return response.status(200).json(brands);
    } catch (error) {
      next(error);
    }
  }
}
