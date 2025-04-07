import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { BadRequestError } from "../errors";

export const validatePathParams =
  <T>(dtoClass: ClassConstructor<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(dtoClass, req.params);
      const errors = await validate(dto as object, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0)
        throw new BadRequestError(
          errors[0].constraints
            ? Object.values(errors[0].constraints)[0]
            : "Requisição inválida"
        );

      req.params = dto as any;
      next();
    } catch (error) {
      next(error);
    }
  };
