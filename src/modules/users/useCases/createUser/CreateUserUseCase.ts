import { CreateUserDTO } from "@modules/users/dtos/CreateUserDTO";
import { IUser } from "@modules/users/interfaces/IUser";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { generateHashedPassword } from "@utils/generateHashedPassword";
import { UserResponseDTO } from "@modules/users/dtos/UserResponseDTO";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute(
    data: CreateUserDTO,
    createdById?: string
  ): Promise<UserResponseDTO> {
    const userByEmail = await this.userRepository.findByEmail(data.email);
    const userByNationalId = data.nationalId
      ? await this.userRepository.findByNationalId(data.nationalId)
      : undefined;

    if (userByEmail)
      throw new ConflictError("Usuário com esse email já existe", "email");
    if (userByNationalId)
      throw new ConflictError("Usuário com esse CPF já existe", "nationalId");

    data.password = await generateHashedPassword(data.password);

    return await this.userRepository.create(data, createdById);
  }
}
