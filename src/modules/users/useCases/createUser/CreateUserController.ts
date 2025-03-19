import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserDTO } from "@modules/users/dtos/CreateUserDTO";

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const data: CreateUserDTO = request.body;
    const createdById = request.user?.id;

    try {
      const createUserUseCase = container.resolve(CreateUserUseCase);
      const createdUser = createdById
        ? await createUserUseCase.execute(data, createdById)
        : await createUserUseCase.execute(data);
      return response.status(201).json(createdUser);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
