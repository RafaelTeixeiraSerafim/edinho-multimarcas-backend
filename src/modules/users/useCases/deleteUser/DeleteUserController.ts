import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { UnauthorizedError } from "@shared/infra/http/errors";

export class DeleteUserController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const userId = request.params.id;
    const deletedById = request.user?.id;

    try {
      if (!deletedById) throw new UnauthorizedError("Usuário não autenticado");

      const deleteUserUseCase = container.resolve(DeleteUserUseCase);
      await deleteUserUseCase.execute(userId, deletedById);
      return response.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
