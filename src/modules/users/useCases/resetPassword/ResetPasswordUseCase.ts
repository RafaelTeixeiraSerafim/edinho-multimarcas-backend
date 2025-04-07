import { ResetPasswordDTO } from "@modules/users/dtos/ResetPasswordDTO";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { generateHashedPassword } from "@utils/generateHashedPassword";
import { inject, injectable } from "tsyringe";

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(data: ResetPasswordDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new NotFoundError("Usuário não encontrado", "email");

    data.password = await generateHashedPassword(data.password);

    await this.userRepository.update(user.id, data, user.id);
  }
}
