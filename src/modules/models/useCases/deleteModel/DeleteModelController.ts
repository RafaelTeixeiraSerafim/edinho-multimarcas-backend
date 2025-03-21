import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteModelUseCase } from "./DeleteModelUseCase";
import { UnauthorizedError } from "@shared/infra/http/errors";

export class DeleteModelController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const modelId = request.params.id;
    const deletedById = request.user?.id;

    try {
      if (!deletedById) throw new UnauthorizedError("Usuário não autenticado");

      const deleteModelUseCase = container.resolve(DeleteModelUseCase);
      await deleteModelUseCase.execute(modelId, deletedById);
      return response.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
