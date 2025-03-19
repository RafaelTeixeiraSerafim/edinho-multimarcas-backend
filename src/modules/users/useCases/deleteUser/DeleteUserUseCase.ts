import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(id: string, deletedById: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user || user.isDeleted) {
      throw new Error("user not found");
    }

    if (user.id !== deletedById)
      throw new Error("user can only delete their own account")

    await this.userRepository.delete(id, deletedById);
  }
}
