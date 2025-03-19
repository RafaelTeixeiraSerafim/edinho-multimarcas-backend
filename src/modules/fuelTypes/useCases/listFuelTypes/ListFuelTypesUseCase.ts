import { inject, injectable } from "tsyringe";
import { IFuelTypeRepository } from "../../repositories/IFuelTypeRepository";

@injectable()
export class ListFuelTypesUseCase {
  constructor(
    @inject("FuelTypeRepository")
    private fuelTypeRepository: IFuelTypeRepository
  ) {}
  async execute(page: number, pageSize: number) {
    return await this.fuelTypeRepository.list(page, pageSize);
  }
}
