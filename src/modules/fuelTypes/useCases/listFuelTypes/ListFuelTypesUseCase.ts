import { inject, injectable } from "tsyringe";
import { IFuelTypeRepository } from "../../repositories/IFuelTypeRepository";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

@injectable()
export class ListFuelTypesUseCase {
  constructor(
    @inject("FuelTypeRepository")
    private fuelTypeRepository: IFuelTypeRepository
  ) {}
  async execute(params: PaginationQueryDTO) {
    return await this.fuelTypeRepository.list(
      params
    );
  }
}
