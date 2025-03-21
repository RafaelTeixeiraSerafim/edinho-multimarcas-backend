import { UserRepository } from "@modules/users/infra/prisma/repositories/UserRepository";
import { IAuthTokenPayload } from "@modules/users/interfaces/IAuthTokenPayload";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UnauthorizedError } from "../errors";

export const ensureAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedError("Token de acesso ausente");

    const [, token] = authHeader.split(" ");

    const tokenSecret = process.env.AUTH_TOKEN_SECRET;
    if (!tokenSecret)
      throw new Error("Variáveis de ambiente de autenticação ausentes");

    const { userId } = verify(token, tokenSecret) as IAuthTokenPayload;

    const userRepository = new UserRepository();
    const user = await userRepository.findById(userId);

    if (!user) throw new UnauthorizedError("Usuário não encontrado");

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
