import { inject, injectable } from "tsyringe";
import { IFuelTypeRepository } from "../../repositories/IFuelTypeRepository";
import { UpdateFuelTypeDTO } from "../../dtos/UpdateFuelTypeDTO";

@injectable()
export class UpdateFuelTypeUseCase {
  constructor(
    @inject("FuelTypeRepository")
    private fuelTypeRepository: IFuelTypeRepository
  ) {}
  async execute(id: string, data: UpdateFuelTypeDTO, updatedById: string) {
    const existsFuelType = data.name ? await this.fuelTypeRepository.findByName(data.name) : undefined;

    if (existsFuelType && existsFuelType.id !== id)
      throw new Error("a fuel type with this name already exists");

    return await this.fuelTypeRepository.update(id, data, updatedById);
  }
}
