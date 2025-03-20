import { UpdateUserDTO } from "@modules/users/dtos/UpdateUserDTO";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(id: string, data: UpdateUserDTO, updatedById: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("user not found");

    const userByEmail = data.email
      ? await this.userRepository.findByEmail(data.email)
      : undefined;
    const userByNationalId = data.nationalId
      ? await this.userRepository.findByNationalId(data.nationalId)
      : undefined;

    if (userByEmail && userByEmail.id !== id)
      throw new ConflictError("user with this email already exists");
    if (userByNationalId && userByNationalId.id !== id)
      throw new ConflictError("user with this nationalId already exists");

    return await this.userRepository.update(id, data, updatedById);
  }
}
