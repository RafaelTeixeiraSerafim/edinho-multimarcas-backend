import { NextFunction, Request, Response } from "express";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  CustomError,
} from "../errors";

export function errorManager(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  res.status(500).json({
    success: false,
    error: {
      name: "InternalServerError",
      message: "Algo deu errado",
      statusCode: 500,
    },
  });
}
