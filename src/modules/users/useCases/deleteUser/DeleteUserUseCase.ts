import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { ForbiddenError } from "@shared/infra/http/errors/ForbiddenError";
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
      throw new NotFoundError("Usuário não encontrado", "id");
    }

    if (user.id !== deletedById)
      throw new ForbiddenError("Usuário só pode excluir sua própria conta");

    await this.userRepository.delete(id, deletedById);
  }
}
