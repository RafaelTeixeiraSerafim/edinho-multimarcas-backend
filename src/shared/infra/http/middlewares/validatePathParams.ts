import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { ClassConstructor, plainToInstance } from "class-transformer";

export const validatePathParams =
  <T>(dtoClass: ClassConstructor<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.params);
    const errors = await validate(dto as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ errors: errors.map((err) => err.constraints) });
    }

    req.params = dto as any; // Replace the params object with the validated DTO
    next();
  };
