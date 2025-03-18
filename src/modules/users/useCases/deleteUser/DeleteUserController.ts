import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

export class DeleteUserController {
  async handle(request: Request, response: Response) {
    const userId = request.params.id;

    try {
      const deleteUserUseCase = container.resolve(DeleteUserUseCase);
      await deleteUserUseCase.execute(userId);
      return response.status(204).json({});
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
