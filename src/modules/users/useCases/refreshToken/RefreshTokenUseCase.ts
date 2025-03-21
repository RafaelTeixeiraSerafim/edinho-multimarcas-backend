import { RefreshTokenDTO } from "@modules/users/dtos/RefreshTokenDTO";
import { IAuthTokenPayload } from "@modules/users/interfaces/IAuthTokenPayload";
import { UserMapper } from "@modules/users/mappers/UserMapper";
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

  async execute(data: RefreshTokenDTO) {
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
      throw new UnauthorizedError("Token de atualização de autenticação inválido");

    const payload = {
      userId: user.id,
    };

    const newToken = sign(payload, tokenSecret, { expiresIn: "15m" });

    const newRefreshToken = sign(payload, refreshTokenSecret, {
      expiresIn: "12h",
    });

    const refreshedUser = await this.userRepository.refreshToken(
      user.id,
      newRefreshToken,
      user.id
    );

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      user: refreshedUser,
    };
  }
}
