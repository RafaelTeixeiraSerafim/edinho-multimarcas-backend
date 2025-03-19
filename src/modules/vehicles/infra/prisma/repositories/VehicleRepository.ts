import { CreateVehicleDTO } from "@modules/vehicles/dtos/CreateVehicleDTO";
import { IVehicle } from "@modules/vehicles/interfaces/IVehicle";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { prisma } from "@shared/infra/prisma";

export class VehicleRepository implements IVehicleRepository {
  async create(data: CreateVehicleDTO): Promise<IVehicle> {
    return await prisma.vehicles.create({ data });
  }

  async findByFuelTypeId(fuelTypeId: string): Promise<IVehicle[]> {
    return await prisma.vehicles.findMany({ where: { fuelTypeId } });
  }
}
