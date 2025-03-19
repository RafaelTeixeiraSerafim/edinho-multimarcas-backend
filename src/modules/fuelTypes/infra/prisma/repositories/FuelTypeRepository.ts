import { CreateFuelTypeDTO } from "@modules/fuelTypes/dtos/CreateFuelTypeDTO";
import { IFuelType } from "@modules/fuelTypes/interfaces/IFuelType";
import { IFuelTypeRepository } from "@modules/fuelTypes/repositories/IFuelTypeRepository";
import { prisma } from "@shared/infra/prisma";

export class FuelTypeRepository implements IFuelTypeRepository {
  async create(data: CreateFuelTypeDTO, createdById: string) {
    return await prisma.fuelTypes.create({ data: { ...data, createdById } });
  }

  async findByName(name: string): Promise<IFuelType | null> {
    return await prisma.fuelTypes.findUnique({ where: { name } });
  }
}
