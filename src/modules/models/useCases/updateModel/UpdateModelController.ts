import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateModelUseCase } from "./UpdateModelUseCase";
import { UpdateModelDTO } from "@modules/models/dtos/UpdateModelDTO";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "@shared/infra/http/errors";

export class UpdateModelController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const modelId = request.params.id;
    const data: UpdateModelDTO = request.body;
    const updatedById = request.user?.id;

    try {
      if (!updatedById) throw new UnauthorizedError("Usuário não autenticado");
      if (!Object.keys(data).length)
        throw new BadRequestError("Corpo da requisição não pode estar vazio");

      const updateModelUseCase = container.resolve(UpdateModelUseCase);
      const updatedModel = await updateModelUseCase.execute(
        modelId,
        data,
        updatedById
      );
      return response.status(200).json(updatedModel);
    } catch (error) {
      next(error);
    }
  }
}
