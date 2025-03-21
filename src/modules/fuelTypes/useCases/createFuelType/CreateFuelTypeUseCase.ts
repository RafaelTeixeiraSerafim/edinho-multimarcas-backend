import { inject, injectable } from "tsyringe";
import { IFuelTypeRepository } from "../../repositories/IFuelTypeRepository";
import { CreateFuelTypeDTO } from "../../dtos/CreateFuelTypeDTO";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";

@injectable()
export class CreateFuelTypeUseCase {
  constructor(
    @inject("FuelTypeRepository")
    private fuelTypeRepository: IFuelTypeRepository
  ) {}

  async execute(data: CreateFuelTypeDTO, createdById: string) {
    const existsFuelType = await this.fuelTypeRepository.findByName(data.name);

    if (existsFuelType)
      throw new ConflictError("Um tipo de combustível com esse nome já existe", "name");

    return await this.fuelTypeRepository.create(data, createdById);
  }
}
