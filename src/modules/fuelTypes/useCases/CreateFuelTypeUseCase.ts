import { inject, injectable } from "tsyringe";
import { IFuelTypeRepository } from "../repositories/IFuelTypeRepository";
import { CreateFuelTypeDTO } from "../dtos/CreateFuelTypeDTO";

@injectable()
export class CreateFuelTypeUseCase {
  constructor(
    @inject("FuelTypeRepository")
    private fuelTypeRepository: IFuelTypeRepository
  ) {}

  async execute(data: CreateFuelTypeDTO, createdById: string) {
    return await this.fuelTypeRepository.create(data, createdById);
  }
}
