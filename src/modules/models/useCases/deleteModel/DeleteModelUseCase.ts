import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteModelUseCase {
  constructor(
    @inject("ModelRepository")
    private modelRepository: IModelRepository,
    @inject("VehicleRepository")
    private vehicleRepository: IVehicleRepository
  ) {}
  async execute(id: string, deletedById: string) {
    const model = await this.modelRepository.findById(id);

    if (!model || model.isDeleted) throw new NotFoundError("model not found");

    const vehicles = await this.vehicleRepository.findByModelId(id);
    vehicles.forEach((vehicle) => this.vehicleRepository.delete(vehicle.id, deletedById))

    await this.modelRepository.delete(id, deletedById);
  }
}
