import { CreateFuelTypeDTO } from "@modules/fuelTypes/dtos/CreateFuelTypeDTO";
import { prisma } from "@shared/infra/prisma";

export class FuelTypeRepository {
  async create(data: CreateFuelTypeDTO, createdById: string) {
    return await prisma.fuelTypes.create({ data: { ...data, createdById } });
  }
}
