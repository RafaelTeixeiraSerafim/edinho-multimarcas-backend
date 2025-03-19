import { UserResponseDTO } from "@modules/users/dtos/UserResponseDTO";
import { IUser } from "@modules/users/interfaces/IUser";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute(page: number, pageSize: number): Promise<UserResponseDTO[]> {
    return await this.userRepository.list(page, pageSize);
  }
}
