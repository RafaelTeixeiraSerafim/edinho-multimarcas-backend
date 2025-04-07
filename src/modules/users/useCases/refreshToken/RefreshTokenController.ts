import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";
import { RefreshTokenDTO } from "@modules/users/dtos/RefreshTokenDTO";

export class RefreshTokenController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const data: RefreshTokenDTO = request.body;

    try {
      const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
      const authData = await refreshTokenUseCase.execute(data);
      console.log(authData)
      return response.status(200).json(authData);
    } catch (error) {
      next(error)
    }
  }
}
