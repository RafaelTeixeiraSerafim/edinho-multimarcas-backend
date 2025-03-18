import { CreateUserDTO } from "@modules/users/dtos/CreateUserDTO";
import { UpdateUserDTO } from "@modules/users/dtos/UpdateUserDTO";
import { IUser } from "@modules/users/interfaces/IUser";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { prisma } from "@shared/infra/prisma";

export class UserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<IUser> {
    return await prisma.users.create({ data });
  }

  async update(id: string, data: UpdateUserDTO): Promise<IUser> {
    return await prisma.users.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.users.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return;
  }

  async list(page: number, pageSize: number): Promise<IUser[]> {
    return await prisma.users.findMany({
      take: pageSize,
      skip: pageSize * (page - 1),
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(id: string): Promise<IUser | null> {
    return await prisma.users.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await prisma.users.findFirst({
      where: { email },
    });
  }

  async findByNationalId(nationalId: string): Promise<IUser | null> {
    return await prisma.users.findFirst({
      where: { nationalId },
    });
  }
}
