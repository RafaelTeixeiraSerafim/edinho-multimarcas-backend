import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUsersUseCase } from "./ListUsersUseCase";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

export class ListUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page = 1, pageSize = 10 } = request.query as PaginationQueryDTO;

    const listUsersUseCase = container.resolve(ListUsersUseCase);

    const users = await listUsersUseCase.execute(page, pageSize);

    return response.status(200).json(users);
  }
}
