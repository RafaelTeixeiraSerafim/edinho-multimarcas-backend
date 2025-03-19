import { UpdateUserDTO } from "@modules/users/dtos/UpdateUserDTO";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(id: string, data: UpdateUserDTO, updatedById: string) {
    const userByEmail = data.email
      ? await this.userRepository.findByEmail(data.email)
      : undefined;
    const userByNationalId = data.nationalId
      ? await this.userRepository.findByNationalId(data.nationalId)
      : undefined;

    if (userByEmail && userByEmail.id !== id)
      throw new Error("user with this email already exists");
    if (userByNationalId && userByNationalId.id !== id)
      throw new Error("user with this nationalId already exists");

    return await this.userRepository.update(id, data, updatedById);
  }
}
