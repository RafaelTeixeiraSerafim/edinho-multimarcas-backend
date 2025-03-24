import { inject, injectable } from "tsyringe";
import { IBrandRepository } from "../../repositories/IBrandRepository";
import { UpdateBrandDTO } from "@modules/brands/dtos/UpdateBrandDTO";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { NotFoundError } from "@shared/infra/http/errors";

@injectable()
export class UpdateBrandUseCase {
  constructor(
    @inject("BrandRepository")
    private brandRepository: IBrandRepository
  ) {}
  async execute(id: string, data: UpdateBrandDTO, updatedById: string) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) throw new NotFoundError("Marca não encontrada", "id");

    if (data.name) {
      const existsBrand = await this.brandRepository.findByName(data.name);

      if (existsBrand && existsBrand.id !== id)
        throw new ConflictError("Uma marca com esse nome já existe", "brand");
    }

    return await this.brandRepository.update(id, data, updatedById);
  }
}
