import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { CreateModelUseCase } from "./CreateModelUseCase";
import { UnauthorizedError } from "@shared/infra/http/errors";

export class CreateModelController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const data = request.body;
    const createdById = request.user?.id;

    try {
      if (!createdById) throw new UnauthorizedError("user not authenticated");

      const createModelUseCase = container.resolve(CreateModelUseCase);
      const createdModel = await createModelUseCase.execute(data, createdById);
      return response.status(201).json(createdModel);
    } catch (error) {
      next(error);
    }
  }
}
