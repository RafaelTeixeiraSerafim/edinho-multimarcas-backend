import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

export class UpdateUserController {
  async handle(request: Request, response: Response) {
    const userId = request.params.id;
    const data = request.body;
    const updatedById = request.user.id;

    try {
      const updateUserUseCase = container.resolve(UpdateUserUseCase);
      const updatedUser = await updateUserUseCase.execute(
        userId,
        data,
        updatedById
      );
      return response.status(200).json(updatedUser);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
