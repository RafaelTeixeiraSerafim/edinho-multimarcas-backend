import { inject, injectable } from "tsyringe";
import { IModelRepository } from "../../repositories/IModelRepository";
import { UpdateModelDTO } from "../../dtos/UpdateModelDTO";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { NotFoundError } from "@shared/infra/http/errors";

@injectable()
export class UpdateModelUseCase {
  constructor(
    @inject("ModelRepository")
    private modelRepository: IModelRepository,
    @inject("BrandRepository")
    private brandRepository: IBrandRepository
  ) {}
  async execute(id: string, data: UpdateModelDTO, updatedById: string) {
    const model = await this.modelRepository.findById(id);
    if (!model) throw new NotFoundError("Modelo não encontrado", "id");

    if (data.name) {
      const existsModel = await this.modelRepository.findByName(data.name);

      if (existsModel && existsModel.id !== id)
        throw new ConflictError("Um modelo com esse nome já existe", "model");
    }

    if (data.brandId) {
      const existsBrand = await this.brandRepository.findById(data.brandId);
      if (!existsBrand)
        throw new NotFoundError("Uma marca com esse id não existe", "brandId");
    }

    return await this.modelRepository.update(id, data, updatedById);
  }
}
