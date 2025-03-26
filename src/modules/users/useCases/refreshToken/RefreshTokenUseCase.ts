import auth from "@config/auth";
import { AuthenticateUserResponseDTO } from "@modules/users/dtos/AuthenticateUserResponseDTO";
import { RefreshTokenDTO } from "@modules/users/dtos/RefreshTokenDTO";
import { IAuthTokenPayload } from "@modules/users/interfaces/IAuthTokenPayload";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { NotFoundError, UnauthorizedError } from "@shared/infra/http/errors";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(data: RefreshTokenDTO): Promise<AuthenticateUserResponseDTO> {
    const refreshToken = data.refreshToken;

    const tokenSecret = process.env.AUTH_TOKEN_SECRET;
    const refreshTokenSecret = process.env.AUTH_REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret || !tokenSecret)
      throw new Error("Variáveis de ambiente de autenticação ausentes");

    const { userId } = verify(
      refreshToken,
      refreshTokenSecret
    ) as IAuthTokenPayload;

    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError("Usuário não encontrado", "userId");

    if (user.refreshToken !== refreshToken)
      throw new UnauthorizedError(
        "Token de atualização de autenticação inválido"
      );

    const payload = {
      userId: user.id,
    };

    const newToken = sign(payload, tokenSecret, { expiresIn: `${auth.accessTokenExpiresInMinutes}m` });

    const newRefreshToken = sign(payload, refreshTokenSecret, {
      expiresIn: `${auth.refreshTokenExpiresInHours}h`,
    });

    const refreshedUser = await this.userRepository.refreshToken(
      user.id,
      newRefreshToken,
      user.id
    );

    return {
      accessToken: newToken,
      refreshToken: newRefreshToken,
      user: refreshedUser,
      tokenExpiry: Date.now() + auth.accessTokenExpiresInMinutes * 60 * 1000,
    };
  }
}
