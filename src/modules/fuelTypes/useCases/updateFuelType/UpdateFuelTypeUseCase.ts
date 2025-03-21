import { inject, injectable } from "tsyringe";
import { IFuelTypeRepository } from "../../repositories/IFuelTypeRepository";
import { UpdateFuelTypeDTO } from "../../dtos/UpdateFuelTypeDTO";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { NotFoundError } from "@shared/infra/http/errors";

@injectable()
export class UpdateFuelTypeUseCase {
  constructor(
    @inject("FuelTypeRepository")
    private fuelTypeRepository: IFuelTypeRepository
  ) {}
  async execute(id: string, data: UpdateFuelTypeDTO, updatedById: string) {
    const fuelType = await this.fuelTypeRepository.findById(id);
    if (!fuelType)
      throw new NotFoundError("Tipo de combustível não encontrado");

    const existsFuelType = data.name
      ? await this.fuelTypeRepository.findByName(data.name)
      : undefined;

    if (existsFuelType && existsFuelType.id !== id)
      throw new ConflictError("Um tipo de combustível com esse nome já existe");

    return await this.fuelTypeRepository.update(id, data, updatedById);
  }
}
