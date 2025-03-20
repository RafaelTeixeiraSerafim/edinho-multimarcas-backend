import { CreateBrandDTO } from "@modules/brands/dtos/CreateBrandDTO";
import { UpdateBrandDTO } from "@modules/brands/dtos/UpdateBrandDTO";
import { IBrand } from "@modules/brands/interfaces/IBrand";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { prisma } from "@shared/infra/prisma";

export class BrandRepository implements IBrandRepository {
  async create(data: CreateBrandDTO, createdById: string): Promise<IBrand> {
    return await prisma.brands.create({ data: { ...data, createdById } });
  }

  async update(
    id: string,
    data: UpdateBrandDTO,
    updatedById: string
  ): Promise<IBrand> {
    return await prisma.brands.update({
      where: { id },
      data: { ...data, updatedById },
    });
  }

  async delete(id: string, deletedById: string): Promise<void> {
    await prisma.brands.update({
      where: { id },
      data: { deletedById, isDeleted: true },
    });
  }

  async list(page: number, pageSize: number): Promise<IBrand[]> {
    return await prisma.brands.findMany({
      take: pageSize,
      skip: pageSize * (page - 1),
      orderBy: { createdAt: "asc" },
      where: {
        isDeleted: false,
      },
    });
  }

  async findById(id: string): Promise<IBrand | null> {
    return await prisma.brands.findUnique({ where: { id, isDeleted: false } });
  }

  async findByName(name: string): Promise<IBrand | null> {
    return await prisma.brands.findFirst({ where: { name, isDeleted: false } });
  }
}
