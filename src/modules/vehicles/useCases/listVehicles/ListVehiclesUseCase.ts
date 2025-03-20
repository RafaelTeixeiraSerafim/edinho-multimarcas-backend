import { inject, injectable } from "tsyringe";
import { IVehicleRepository } from "../../repositories/IVehicleRepository";

@injectable()
export class ListVehiclesUseCase {
  constructor(
    @inject("VehicleRepository")
    private vehicleRepository: IVehicleRepository
  ) {}
  async execute(page: number, pageSize: number) {
    return await this.vehicleRepository.list(page, pageSize);
  }
}
