import { inject, injectable } from "tsyringe";
import { IBrandRepository } from "../../repositories/IBrandRepository";
import { CreateBrandDTO } from "../../dtos/CreateBrandDTO";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";

@injectable()
export class CreateBrandUseCase {
  constructor(
    @inject("BrandRepository")
    private brandRepository: IBrandRepository
  ) {}
  async execute(data: CreateBrandDTO, createdById: string) {
    const existsBrand = await this.brandRepository.findByName(data.name);

    if (existsBrand)
      throw new ConflictError("a brand with this name already exists");

    return await this.brandRepository.create(data, createdById);
  }
}
