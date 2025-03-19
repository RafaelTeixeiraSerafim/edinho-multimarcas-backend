import { inject, injectable } from "tsyringe";
import { IBrandRepository } from "../../repositories/IBrandRepository";
import { CreateBrandDTO } from "../../dtos/CreateBrandDTO";

@injectable()
export class CreateBrandUseCase {
  constructor(
    @inject("BrandRepository")
    private brandRepository: IBrandRepository
  ) {}
  async execute(data: CreateBrandDTO, createdById: string) {
    return await this.brandRepository.create(data, createdById);
  }
}
