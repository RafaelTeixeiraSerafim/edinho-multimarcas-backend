import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

export class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const data = request.body;

    try {
      const authenticateUserUseCase = container.resolve(
        AuthenticateUserUseCase
      );
      const authResponse = await authenticateUserUseCase.execute(data);
      return response.status(200).json(authResponse);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
