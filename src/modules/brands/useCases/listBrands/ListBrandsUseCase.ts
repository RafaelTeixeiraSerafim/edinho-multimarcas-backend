import { inject, injectable } from "tsyringe";
import { IBrandRepository } from "../../repositories/IBrandRepository";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

@injectable()
export class ListBrandsUseCase {
  constructor(
    @inject("BrandRepository")
    private brandRepository: IBrandRepository
  ) {}
  async execute(
    params: PaginationQueryDTO
  ) {
    return await this.brandRepository.list(params);
  }
}
