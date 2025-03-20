import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { CreateModelDTO } from "@modules/models/dtos/CreateModelDTO";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
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
      throw new ConflictError("a model with this name already exists");

    const existsBrand = this.brandRepository.findById(data.brandId);
    if (!existsBrand)
      throw new NotFoundError("a brand with this id does not exist");

    return await this.modelRepository.create(data, createdById);
  }
}
