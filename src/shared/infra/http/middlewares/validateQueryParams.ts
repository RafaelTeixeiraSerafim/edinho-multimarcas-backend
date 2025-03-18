import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { ClassConstructor, plainToInstance } from "class-transformer";

export const validateQueryParams =
  <T>(dtoClass: ClassConstructor<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.query);
    const errors = await validate(dto as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ errors: errors.map((err) => err.constraints) });
    }

    req.query = dto as any; // Replace the query object with the validated DTO
    next();
  };
