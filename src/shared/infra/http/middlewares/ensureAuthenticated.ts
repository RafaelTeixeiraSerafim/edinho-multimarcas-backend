import { Response, NextFunction, Request } from "express";
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

  if (!authHeader)
    return res.status(401).json({ error: "authorization token is missing" });

  const [, token] = authHeader.split(" ");

  try {
    const tokenSecret = process.env.AUTH_TOKEN_SECRET;
    if (!tokenSecret)
      return res
        .status(500)
        .json({ error: "server error" });

    const { userId } = verify(token, tokenSecret) as IPayload;

    if (!userId)
      return res.status(401).json({ error: "invalid or expired authentication token" });

    const userRepository = new UserRepository();
    const user = await userRepository.findById(userId);

    if (!user)
      return res.status(401).json({ error: "invalid or expired authentication token" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "invalid or expired authentication token" });
  }
};
