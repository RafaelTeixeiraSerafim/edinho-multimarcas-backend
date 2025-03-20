import { inject, injectable } from "tsyringe";
import { IVehicleRepository } from "../../repositories/IVehicleRepository";
import { UpdateVehicleDTO } from "../../dtos/UpdateVehicleDTO";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { IFuelTypeRepository } from "@modules/fuelTypes/repositories/IFuelTypeRepository";
import { ForbiddenError } from "@shared/infra/http/errors/ForbiddenError";

@injectable()
export class UpdateVehicleUseCase {
  constructor(
    @inject("VehicleRepository")
    private vehicleRepository: IVehicleRepository,
    @inject("ModelRepository")
    private modelRepository: IModelRepository,
    @inject("FuelTypeRepository")
    private fuelTypeRepository: IFuelTypeRepository
  ) {}
  async execute(id: string, data: UpdateVehicleDTO, updatedById: string) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) throw new NotFoundError("vehicle not found");

    const existsVehicle = await this.vehicleRepository.findExistingVehicle(
      vehicle
    );
    if (existsVehicle && existsVehicle.id !== id)
      throw new ConflictError("a vehicle with this data already exists");

    if (data.modelId) {
      const existsModel = await this.modelRepository.findById(data.modelId);
      if (!existsModel)
        throw new NotFoundError("a model with this id does not exist");
    }

    if (data.fuelTypeId) {
      const existsFuelType = await this.fuelTypeRepository.findById(data.fuelTypeId);
      if (!existsFuelType)
        throw new NotFoundError("a fuel type with this id does not exist");
    }

    if (vehicle.fipeCode && data.value) throw new ForbiddenError("cannot update the value of a vehicle with a FIPE code")

    return await this.vehicleRepository.update(id, data, updatedById);
  }
}
