import { UnauthorizedError, ValidationError } from "@shared/infra/http/errors";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

export class UpdateUserController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const userId = request.params.id;
    const data = request.body;
    const updatedById = request.user?.id;

    try {
      if (!updatedById) throw new UnauthorizedError("Usuário não autenticado");
      if (!Object.keys(data).length)
        throw new ValidationError("Corpo da requisição não pode estar vazio");

      const updateUserUseCase = container.resolve(UpdateUserUseCase);
      const updatedUser = await updateUserUseCase.execute(
        userId,
        data,
        updatedById
      );
      return response.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}
