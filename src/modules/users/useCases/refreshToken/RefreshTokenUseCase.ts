import { RefreshTokenDTO } from "@modules/users/dtos/RefreshTokenDTO";
import { IAuthTokenPayload } from "@modules/users/interfaces/IAuthTokenPayload";
import { UserMapper } from "@modules/users/mappers/UserMapper";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
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
      throw new Error("server missing required env variable(s)");

    const { userId } = verify(
      refreshToken,
      refreshTokenSecret
    ) as IAuthTokenPayload;

    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("user not found");

    if (user.refreshToken !== refreshToken) throw new Error("invalid refresh token");

    const payload = {
      userId: user.id,
    };

    const newToken = sign(payload, tokenSecret, { expiresIn: "15m" });

    const newRefreshToken = sign(payload, refreshTokenSecret, {
      expiresIn: "12h",
    });

    await this.userRepository.update(
      user.id,
      {
        refreshToken: newRefreshToken,
      },
      user.id
    );

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      user: UserMapper.toUserResponseDTO(user),
    };
  }
}
