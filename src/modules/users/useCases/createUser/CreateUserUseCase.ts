import { CreateUserDTO } from "@modules/users/dtos/CreateUserDTO";
import { IUser } from "@modules/users/interfaces/IUser";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { generateHashedPassword } from "@utils/generateHashedPassword";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute(data: CreateUserDTO): Promise<IUser> {
    const userByEmail = await this.userRepository.findByEmail(data.email);
    const userByNationalId = data.nationalId
      ? await this.userRepository.findByNationalId(data.nationalId)
      : undefined;

    if (userByEmail || userByNationalId) {
      throw new Error("user with this email and/or nationalId already exists");
    }

    data.password = await generateHashedPassword(data.password);

    return await this.userRepository.create(data);
  }
}
