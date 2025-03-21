import { inject, injectable } from "tsyringe";
import { IFuelTypeRepository } from "../../repositories/IFuelTypeRepository";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";

@injectable()
export class DeleteFuelTypeUseCase {
  constructor(
    @inject("FuelTypeRepository")
    private fuelTypeRepository: IFuelTypeRepository,
    @inject("VehicleRepository")
    private vehicleRepository: IVehicleRepository
  ) {}
  async execute(id: string, deletedById: string) {
    const fuelType = await this.fuelTypeRepository.findById(id);

    const vehicles = await this.vehicleRepository.findByFuelTypeId(id);
    if (vehicles.length)
      throw new ConflictError(
        "Não é possível excluir um tipo de combustível utilizado por um ou mais veículos"
      );

    if (!fuelType || fuelType.isDeleted)
      throw new NotFoundError("Tipo de combustível não encontrado");

    await this.fuelTypeRepository.delete(id, deletedById);
  }
}
