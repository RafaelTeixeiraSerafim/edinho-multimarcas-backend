import { AuthenticateUserDTO } from "@modules/users/dtos/AuthenticateUserDTO";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { AuthenticateUserResponseDTO } from "@modules/users/dtos/AuthenticateUserResponseDTO";
import { UserMapper } from "@modules/users/mappers/UserMapper";

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

    if (!user) throw new Error("user not found");

    const samePassword = await bcrypt.compare(data.password, user.password);
    if (!samePassword) {
      throw new Error("incorrect email or password");
    }

    const payload = {
      userId: user.id,
    };

    const tokenSecret = process.env.AUTH_TOKEN_SECRET;
    const refreshTokenSecret = process.env.AUTH_REFRESH_TOKEN_SECRET;

    if (!tokenSecret || !refreshTokenSecret)
      throw new Error("server missing required environment variable");

    const token = sign(payload, tokenSecret, { expiresIn: "15m" });

    const refreshToken = sign(payload, refreshTokenSecret, {
      expiresIn: "12h",
    });

    await this.userRepository.update(
      user.id,
      {
        refreshToken,
      },
      user.id
    );

    return {
      token,
      refreshToken,
      user: UserMapper.toUserResponseDTO(user),
    };
  }
}
