import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ListUsersUseCase } from "./ListUsersUseCase";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

export class ListUsersController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { page = 0, pageSize = 10 } = request.query as PaginationQueryDTO;

    try {
      const listUsersUseCase = container.resolve(ListUsersUseCase);
      const users = await listUsersUseCase.execute(page, pageSize);

      return response.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  }
}
