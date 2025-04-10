import { BrandResponseDTO } from "@modules/brands/dtos/BrandResponseDTO";
import { CreateBrandDTO } from "@modules/brands/dtos/CreateBrandDTO";
import { UpdateBrandDTO } from "@modules/brands/dtos/UpdateBrandDTO";
import { IBrand } from "@modules/brands/interfaces/IBrand";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { ListResponseDTO } from "@shared/dtos/ListResponseDTO";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";
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

  async list(
    params: PaginationQueryDTO
  ): Promise<ListResponseDTO<BrandResponseDTO>> {
    const {
      page = 0,
      pageSize = 10,
      search = "",
      orderBy = "asc",
      orderByField = "createdAt",
    } = params;

    const items = await prisma.brands.findMany({
      take: pageSize,
      skip: pageSize * page,
      orderBy: { [orderByField]: orderBy },
      where: {
        isDeleted: false,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { fipeCode: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      omit: {
        deletedAt: true,
        deletedById: true,
        isDeleted: true,
      },
    });

    const total = items.length;

    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      total,
      totalPages,
    };
  }

  async findById(id: string): Promise<IBrand | null> {
    return await prisma.brands.findUnique({ where: { id, isDeleted: false } });
  }

  async findByName(name: string): Promise<IBrand | null> {
    return await prisma.brands.findFirst({ where: { name, isDeleted: false } });
  }
}
