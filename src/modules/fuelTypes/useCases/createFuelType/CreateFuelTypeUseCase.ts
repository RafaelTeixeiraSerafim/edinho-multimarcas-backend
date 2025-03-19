import { inject, injectable } from "tsyringe";
import { IFuelTypeRepository } from "../../repositories/IFuelTypeRepository";
import { CreateFuelTypeDTO } from "../../dtos/CreateFuelTypeDTO";

@injectable()
export class CreateFuelTypeUseCase {
  constructor(
    @inject("FuelTypeRepository")
    private fuelTypeRepository: IFuelTypeRepository
  ) {}

  async execute(data: CreateFuelTypeDTO, createdById: string) {
    const existsFuelType = await this.fuelTypeRepository.findByName(data.name);

    if (existsFuelType)
      throw new Error("a fuel type with this name already exists");

    return await this.fuelTypeRepository.create(data, createdById);
  }
}
