import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { CreateBrandUseCase } from "./CreateBrandUseCase";
import { UnauthorizedError } from "@shared/infra/http/errors";

export class CreateBrandController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const data = request.body;
    const createdById = request.user?.id;
    
    try {
      if (!createdById) throw new UnauthorizedError("user not authenticated");
      
      const createBrandUseCase = container.resolve(CreateBrandUseCase);
      const createdBrand = await createBrandUseCase.execute(data, createdById);
      return response.status(201).json(createdBrand);
    } catch (error) {
      next(error);
    }
  }
}
