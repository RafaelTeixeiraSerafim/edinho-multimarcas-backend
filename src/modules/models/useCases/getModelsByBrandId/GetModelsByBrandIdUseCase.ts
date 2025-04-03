import { inject, injectable } from "tsyringe";
import { IModelRepository } from "../../repositories/IModelRepository";

@injectable()
export class GetModelsByBrandIdUseCase {
  constructor(
    @inject("ModelRepository")
    private modelRepository: IModelRepository
  ) {}
  async execute(brandId: string) {
    return await this.modelRepository.findByBrandId(brandId);
  }
}
