import { inject, injectable } from "tsyringe";
import { IBrandRepository } from "../../repositories/IBrandRepository";
import { UpdateBrandDTO } from "@modules/brands/dtos/UpdateBrandDTO";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";

@injectable()
export class ListBrandsUseCase {
  constructor(
    @inject("BrandRepository")
    private brandRepository: IBrandRepository
  ) {}
  async execute(page: number, pageSize: number) {
    return await this.brandRepository.list(page, pageSize);
  }
}
