import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteBrandUseCase } from "./DeleteBrandUseCase";
import { UnauthorizedError } from "@shared/infra/http/errors";

export class DeleteBrandController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const brandId = request.params.id;
    const deletedById = request.user?.id;
    
    try {
      if (!deletedById) throw new UnauthorizedError("user not authenticated");
      
      const deleteBrandUseCase = container.resolve(DeleteBrandUseCase);
      await deleteBrandUseCase.execute(brandId, deletedById);
      return response.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
