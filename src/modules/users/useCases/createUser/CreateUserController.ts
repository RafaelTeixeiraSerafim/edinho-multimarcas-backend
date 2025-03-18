import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserDTO } from "@modules/users/dtos/CreateUserDTO";

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const data: CreateUserDTO = request.body;

    try {
      const createUserUseCase = container.resolve(CreateUserUseCase);
      const createdUser = await createUserUseCase.execute(data);
      return response.status(201).json(createdUser);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { CreateUserController };
