import { inject, injectable } from "tsyringe";
import { IVehicleRepository } from "../../repositories/IVehicleRepository";

@injectable()
export class GetVehiclesByModelIdUseCase {
  constructor(
    @inject("VehicleRepository")
    private vehicleRepository: IVehicleRepository
  ) {}
  async execute(modelId: string) {
    return await this.vehicleRepository.findByModelId(modelId);
  }
}
