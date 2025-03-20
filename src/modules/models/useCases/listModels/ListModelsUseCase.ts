import { inject, injectable } from "tsyringe";
import { IModelRepository } from "../../repositories/IModelRepository";

@injectable()
export class ListModelsUseCase {
  constructor(
    @inject("ModelRepository")
    private modelRepository: IModelRepository
  ) {}
  async execute(page: number, pageSize: number) {
    return await this.modelRepository.list(page, pageSize);
  }
}
