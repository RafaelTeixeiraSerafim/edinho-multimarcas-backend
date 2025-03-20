import { CreateVehicleDTO } from "@modules/vehicles/dtos/CreateVehicleDTO";
import { UpdateVehicleDTO } from "@modules/vehicles/dtos/UpdateVehicleDTO";
import { IPartialVehicle } from "@modules/vehicles/interfaces/IPartialVehicle";
import { IVehicle } from "@modules/vehicles/interfaces/IVehicle";
import { IVehicleRepository } from "@modules/vehicles/repositories/IVehicleRepository";
import { prisma } from "@shared/infra/prisma";

export class VehicleRepository implements IVehicleRepository {
  async create(data: CreateVehicleDTO, createdById: string): Promise<IVehicle> {
    return await prisma.vehicles.create({ data: { ...data, createdById } });
  }

  async update(
    id: string,
    data: UpdateVehicleDTO,
    updatedById: string
  ): Promise<IVehicle> {
    return await prisma.vehicles.update({
      where: { id },
      data: { ...data, updatedById },
    });
  }

  async delete(id: string, deletedById: string): Promise<void> {
    await prisma.vehicles.update({
      where: { id },
      data: { isDeleted: true, deletedById },
    });
  }

  async list(page: number, pageSize: number): Promise<IVehicle[]> {
    return await prisma.vehicles.findMany({
      where: { isDeleted: false },
      skip: pageSize * (page - 1),
      take: pageSize,
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(id: string): Promise<IVehicle | null> {
    return await prisma.vehicles.findUnique({
      where: { id, isDeleted: false },
    });
  }

  async findByFuelTypeId(fuelTypeId: string): Promise<IVehicle[]> {
    return await prisma.vehicles.findMany({
      where: { fuelTypeId, isDeleted: false },
    });
  }

  async findByModelId(modelId: string): Promise<IVehicle[]> {
    return await prisma.vehicles.findMany({
      where: { modelId, isDeleted: false },
    });
  }

  async findExistingVehicle(
    data: IPartialVehicle
  ): Promise<IVehicle | null> {
    return await prisma.vehicles.findFirst({
      where: {
        value: data.value,
        vehicleYear: data.vehicleYear,
        referenceMonth: data.referenceMonth,
        referenceYear: data.referenceYear,
        modelId: data.modelId,
        fuelTypeId: data.fuelTypeId,
      },
    });
  }
}
