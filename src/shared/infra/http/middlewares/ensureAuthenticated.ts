import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { verify } from "jsonwebtoken";
import { UserRepository } from "@modules/users/infra/prisma/repositories/UserRepository";

interface IPayload {
  userId: string;
}

export const ensureAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new Error("authorization token missing");

  const [, token] = authHeader.split(" ");

  try {
    const tokenSecret = process.env.AUTH_TOKEN_SECRET;
    if (!tokenSecret)
      throw new Error("server missing required environment variable");

    const { userId } = verify(token, tokenSecret) as IPayload;

    const userRepository = new UserRepository()
    const user = await userRepository.findById(userId)

  } catch (error) {}
  next();
};
