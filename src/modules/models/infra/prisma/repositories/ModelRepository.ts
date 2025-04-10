import { CreateModelDTO } from "@modules/models/dtos/CreateModelDTO";
import { ModelResponseDTO } from "@modules/models/dtos/ModelResponseDTO";
import { UpdateModelDTO } from "@modules/models/dtos/UpdateModelDTO";
import { IModel } from "@modules/models/interfaces/IModel";
import { IModelRepository } from "@modules/models/repositories/IModelRepository";
import { prisma } from "@shared/infra/prisma";

export class ModelRepository implements IModelRepository {
  async create(data: CreateModelDTO, createdById: string): Promise<IModel> {
    return await prisma.models.create({ data: { ...data, createdById } });
  }

  async update(
    id: string,
    data: UpdateModelDTO,
    updatedById: string
  ): Promise<IModel> {
    return await prisma.models.update({
      where: { id },
      data: { ...data, updatedById },
    });
  }

  async delete(id: string, deletedById: string): Promise<void> {
    await prisma.models.update({
      where: { id },
      data: { isDeleted: true, deletedById },
    });
  }

  async list(page: number, pageSize: number): Promise<ModelResponseDTO[]> {
    return await prisma.models.findMany({
      take: pageSize,
      skip: pageSize * page,
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

  async findById(id: string): Promise<IModel | null> {
    return await prisma.models.findUnique({ where: { id, isDeleted: false } });
  }

  async findByBrandId(brandId: string): Promise<IModel[]> {
    return await prisma.models.findMany({
      where: { brandId, isDeleted: false },
    });
  }

  async findByName(name: string): Promise<IModel | null> {
    return await prisma.models.findFirst({
      where: { name, isDeleted: false },
    });
  }
}
