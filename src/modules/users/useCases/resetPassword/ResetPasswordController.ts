import { UnauthorizedError, ValidationError } from "@shared/infra/http/errors";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";

export class ResetPasswordController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const data = request.body;

    try {
      const recoverPasswordUseCase = container.resolve(ResetPasswordUseCase);
      await recoverPasswordUseCase.execute(data);
      return response.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
}
