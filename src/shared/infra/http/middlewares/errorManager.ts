import { NextFunction, Request, Response } from "express";

import {
  ValidationError,
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
  console.error(`[${err.name}]: ${err.message}`)
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

  // Handle other types of errors
  res.status(500).json({
    success: false,
    error: {
      name: "InternalServerError",
      message: "Something went wrong",
      statusCode: 500,
    },
  });
}
