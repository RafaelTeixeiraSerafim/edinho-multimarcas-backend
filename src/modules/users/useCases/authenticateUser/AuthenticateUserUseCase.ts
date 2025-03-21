import { AuthenticateUserDTO } from "@modules/users/dtos/AuthenticateUserDTO";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { AuthenticateUserResponseDTO } from "@modules/users/dtos/AuthenticateUserResponseDTO";
import { UserMapper } from "@modules/users/mappers/UserMapper";
import { NotFoundError, UnauthorizedError } from "@shared/infra/http/errors";

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(
    data: AuthenticateUserDTO
  ): Promise<AuthenticateUserResponseDTO> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) throw new UnauthorizedError("Email e/ou senha incorretos");

    const samePassword = await bcrypt.compare(data.password, user.password);
    if (!samePassword)
      throw new UnauthorizedError("Email e/ou senha incorretos");

    const payload = {
      userId: user.id,
    };

    const tokenSecret = process.env.AUTH_TOKEN_SECRET;
    const refreshTokenSecret = process.env.AUTH_REFRESH_TOKEN_SECRET;

    if (!tokenSecret || !refreshTokenSecret)
      throw new Error("Variáveis de ambiente de autenticação ausentes");

    const accessToken = sign(payload, tokenSecret, { expiresIn: "15m" });

    const refreshToken = sign(payload, refreshTokenSecret, {
      expiresIn: "12h",
    });

    const refreshedUser = await this.userRepository.refreshToken(
      user.id,
      refreshToken,
      user.id
    );

    return {
      accessToken,
      refreshToken,
      user: refreshedUser,
    };
  }
}
