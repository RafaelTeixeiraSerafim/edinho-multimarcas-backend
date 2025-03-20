import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

export class RefreshTokenController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const data = request.body;

    try {
      const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
      const authData = await refreshTokenUseCase.execute(data);
      return response.status(200).json(authData);
    } catch (error) {
      next(error)
    }
  }
}
