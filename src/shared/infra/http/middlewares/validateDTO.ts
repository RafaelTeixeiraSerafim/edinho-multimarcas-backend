import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../errors";

export const validateDTO =
  (dtoClass: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(dtoClass, req.body);
      const errors = await validate(dto);

      if (errors.length > 0)
        throw new ValidationError(
          errors[0].constraints
            ? Object.values(errors[0].constraints)[0]
            : "Requisição inválida"
        );

      req.body = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
