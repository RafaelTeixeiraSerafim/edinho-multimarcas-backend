import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { DeleteModelUseCase } from "@modules/models/useCases/deleteModel/DeleteModelUseCase";
import { NotFoundError } from "@shared/infra/http/errors";
import { container, inject, injectable } from "tsyringe";
import { IBrandRepository } from "../../repositories/IBrandRepository";

@injectable()
export class DeleteBrandUseCase {
  constructor(
    @inject("BrandRepository")
    private brandRepository: IBrandRepository,
    @inject("ModelRepository")
    private modelRepository: IModelRepository
  ) {}
  async execute(id: string, deletedById: string) {
    const brand = await this.brandRepository.findById(id);

    if (!brand || brand.isDeleted)
      throw new NotFoundError("Marca não encontrada", "id");

    const deleteModelUseCase = container.resolve(DeleteModelUseCase);
    const models = await this.modelRepository.findByBrandId(id);
    models.forEach((model) =>
      deleteModelUseCase.execute(model.id, deletedById)
    );

    await this.brandRepository.delete(id, deletedById);
  }
}
