import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { IFuelTypeRepository } from "@modules/fuelTypes/repositories/IFuelTypeRepository";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { CreateVehicleDTO } from "@modules/vehicles/dtos/CreateVehicleDTO";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { NotFoundError } from "@shared/infra/http/errors";
import { ConflictError } from "@shared/infra/http/errors/ConflictError";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateVehicleUseCase {
  constructor(
    @inject("VehicleRepository")
    private vehicleRepository: IVehicleRepository,
    @inject("ModelRepository")
    private modelRepository: IModelRepository,
    @inject("FuelTypeRepository")
    private fuelTypeRepository: IFuelTypeRepository
  ) {}
  async execute(data: CreateVehicleDTO, createdById: string) {
    const existsVehicle = await this.vehicleRepository.findExistingVehicle(
      data
    );
    if (existsVehicle)
    throw new ConflictError("Um veículo com esses dados já existe", "vehicle");

    const existsModel = await this.modelRepository.findById(data.modelId);
    if (!existsModel)
      throw new NotFoundError("Uma marca com esse id não existe", "modelId");

    const existsFuelType = await this.fuelTypeRepository.findById(
      data.fuelTypeId
    );
    if (!existsFuelType)
      throw new NotFoundError("Um tipo de combustível com esse id não existe", "fuelTypeId");

    return await this.vehicleRepository.create(data, createdById);
  }
}
