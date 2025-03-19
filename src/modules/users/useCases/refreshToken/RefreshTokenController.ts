import { Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

export class RefreshTokenController {
  async handle(request: Request, response: Response) {
    const data = request.body;

    try {
      const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
      const authData = await refreshTokenUseCase.execute(data);
      return response.status(200).json(authData);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
