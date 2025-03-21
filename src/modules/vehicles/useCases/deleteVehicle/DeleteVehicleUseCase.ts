import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { ForbiddenError } from "@shared/infra/http/errors/ForbiddenError";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteVehicleUseCase {
  constructor(
    @inject("VehicleRepository")
    private vehicleRepository: IVehicleRepository
  ) {}
  async execute(id: string, deletedById: string) {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle || vehicle.isDeleted)
      throw new NotFoundError("Veículo não encontrado");

    if (vehicle.fipeCode)
      throw new ForbiddenError(
        "Não é possível excluir um veículo que possui um código FIPE"
      );

    await this.vehicleRepository.delete(id, deletedById);
  }
}
