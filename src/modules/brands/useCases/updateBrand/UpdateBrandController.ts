import { UnauthorizedError, BadRequestError } from "@shared/infra/http/errors";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateBrandUseCase } from "./UpdateBrandUseCase";

export class UpdateBrandController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const brandId = request.params.id;
    const data = request.body;
    const updatedById = request.user?.id;

    try {
      if (!updatedById) throw new UnauthorizedError("Usuário não autenticado");
      if (!Object.keys(data).length)
        throw new BadRequestError("Corpo da requisição não pode estar vazio");

      const updateBrandUseCase = container.resolve(UpdateBrandUseCase);
      const updatedBrand = await updateBrandUseCase.execute(
        brandId,
        data,
        updatedById
      );
      return response.status(200).json(updatedBrand);
    } catch (error) {
      next(error);
    }
  }
}
