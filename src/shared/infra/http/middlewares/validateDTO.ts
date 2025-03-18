import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export const validateDTO = (dtoClass: any) => async (req: Request, res: Response, next: NextFunction) => {
  const dto = plainToInstance(dtoClass, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.body = dto;
  next();
};
