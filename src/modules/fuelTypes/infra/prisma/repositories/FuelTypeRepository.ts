import { CreateFuelTypeDTO } from "@modules/fuelTypes/dtos/CreateFuelTypeDTO";
import { FuelTypeResponseDTO } from "@modules/fuelTypes/dtos/FuelTypeResponseDTO";
import { UpdateFuelTypeDTO } from "@modules/fuelTypes/dtos/UpdateFuelTypeDTO";
import { IFuelType } from "@modules/fuelTypes/interfaces/IFuelType";
import { IFuelTypeRepository } from "@modules/fuelTypes/repositories/IFuelTypeRepository";
import { prisma } from "@shared/infra/prisma";

export class FuelTypeRepository implements IFuelTypeRepository {
  async create(data: CreateFuelTypeDTO, createdById: string) {
    return await prisma.fuelTypes.create({ data: { ...data, createdById } });
  }

  async update(
    id: string,
    data: UpdateFuelTypeDTO,
    updatedById: string
  ): Promise<IFuelType> {
    return await prisma.fuelTypes.update({
      where: { id },
      data: { ...data, updatedById },
    });
  }

  async delete(id: string, deletedById: string): Promise<void> {
    await prisma.fuelTypes.update({
      where: { id },
      data: { deletedById, isDeleted: true },
    });
  }

  async list(page: number, pageSize: number): Promise<FuelTypeResponseDTO[]> {
    return await prisma.fuelTypes.findMany({
      take: pageSize,
      skip: pageSize * (page - 1),
      orderBy: { createdAt: "asc" },
      where: {
        isDeleted: false,
      },
      omit: {
        deletedAt: true,
        deletedById: true,
        isDeleted: true,
      },
    });
  }

  async findByName(name: string): Promise<IFuelType | null> {
    return await prisma.fuelTypes.findFirst({
      where: { name, isDeleted: false },
    });
  }

  async findById(id: string): Promise<IFuelType | null> {
    return await prisma.fuelTypes.findUnique({
      where: { id, isDeleted: false },
    });
  }
}
