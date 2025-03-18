import { CreateVehicleDTO } from "@modules/vehicles/dtos/CreateVehicleDTO";
import { IVehicle } from "@modules/vehicles/interfaces/IVehicle";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { injectable, inject } from "tsyringe";

@injectable()
class CreateVehicleUseCase {
  constructor(
    @inject("VehicleRepository")
    private vehicleRepository: IVehicleRepository
  ) {}
  async execute(data: CreateVehicleDTO): Promise<IVehicle> {
    return await this.vehicleRepository.create(data);
  }
}

export { CreateVehicleUseCase };
