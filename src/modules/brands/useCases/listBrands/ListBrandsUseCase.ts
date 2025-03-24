import { inject, injectable } from "tsyringe";
import { IBrandRepository } from "../../repositories/IBrandRepository";

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
