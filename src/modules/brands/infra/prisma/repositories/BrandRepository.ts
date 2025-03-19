import { CreateBrandDTO } from "@modules/brands/dtos/CreateBrandDTO";
import { IBrand } from "@modules/brands/interfaces/IBrand";
import { IBrandRepository } from "@modules/brands/repositories/IBrandRepository";
import { prisma } from "@shared/infra/prisma";

export class BrandRepository implements IBrandRepository {
  async create(data: CreateBrandDTO, createdById: string): Promise<IBrand> {
    return await prisma.brands.create({ data: { ...data, createdById } });
  }
}
