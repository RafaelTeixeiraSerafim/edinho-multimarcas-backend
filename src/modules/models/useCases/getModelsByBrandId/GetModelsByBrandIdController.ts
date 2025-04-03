import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { GetModelsByBrandIdUseCase } from "./GetModelsByBrandIdUseCase";

export class GetModelsByBrandIdController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const brandId = request.params.brandId;

    try {
      const getModelByBrandIdUseCase = container.resolve(
        GetModelsByBrandIdUseCase
      );
      const models = await getModelByBrandIdUseCase.execute(brandId);
      return response.status(200).json({ models });
    } catch (error) {
      next(error);
    }
  }
}
