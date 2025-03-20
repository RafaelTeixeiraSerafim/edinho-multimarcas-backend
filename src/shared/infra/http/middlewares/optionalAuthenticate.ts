import { UserRepository } from "@modules/users/infra/prisma/repositories/UserRepository";
import { IAuthTokenPayload } from "@modules/users/interfaces/IAuthTokenPayload";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [, token] = authHeader.split(" ");

  const tokenSecret = process.env.AUTH_TOKEN_SECRET;
  if (!tokenSecret) {
    return res.status(500).json({ error: "server error" });
  }

  try {
    const { userId } = verify(token, tokenSecret) as IAuthTokenPayload;

    const userRepository = new UserRepository();
    const user = await userRepository.findById(userId);

    req.user = user ? user : undefined;

    next();
  } catch (error) {
    next();
  }
};
