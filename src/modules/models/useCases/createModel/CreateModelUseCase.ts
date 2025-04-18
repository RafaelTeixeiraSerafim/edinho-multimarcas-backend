import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { CreateModelDTO } from "@modules/models/dtos/CreateModelDTO";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { ConflictError, NotFoundError } from "@shared/infra/http/errors";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateModelUseCase {
  constructor(
    @inject("ModelRepository")
    private modelRepository: IModelRepository,
    @inject("BrandRepository")
    private brandRepository: IBrandRepository
  ) {}
  async execute(data: CreateModelDTO, createdById: string) {
    const existsModel = await this.modelRepository.findByName(data.name);
    if (existsModel)
      throw new ConflictError("Um modelo com esse nome já existe", "name");

    const existsBrand = await this.brandRepository.findById(data.brandId);
    if (!existsBrand)
      throw new NotFoundError("Uma marca com esse id não existe", "brandId");

    return await this.modelRepository.create(data, createdById);
  }
}
