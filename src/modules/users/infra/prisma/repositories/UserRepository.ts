import { CreateUserDTO } from "@modules/users/dtos/CreateUserDTO";
import { ResetPasswordDTO } from "@modules/users/dtos/ResetPasswordDTO";
import { UpdateUserDTO } from "@modules/users/dtos/UpdateUserDTO";
import { UserResponseDTO } from "@modules/users/dtos/UserResponseDTO";
import { IUser } from "@modules/users/interfaces/IUser";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { prisma } from "@shared/infra/prisma";

export class UserRepository implements IUserRepository {
  async create(
    data: CreateUserDTO,
    createdById?: string
  ): Promise<UserResponseDTO> {
    let user = await prisma.users.create({ data: { ...data, createdById } });

    if (!createdById)
      user = await prisma.users.update({
        where: { id: user.id },
        data: { createdById: user.id },
      });

    const {
      password,
      refreshToken,
      deletedAt,
      deletedById,
      isDeleted,
      ...userResponse
    } = user;
    return userResponse;
  }

  async update(
    id: string,
    data: UpdateUserDTO,
    updatedById: string
  ): Promise<UserResponseDTO> {
    return await prisma.users.update({
      where: { id },
      data: {
        ...data,
        updatedById,
      },
      omit: {
        password: true,
        refreshToken: true,
        isDeleted: true,
        deletedAt: true,
        deletedById: true,
      },
    });
  }

  async refreshToken(
    id: string,
    refreshToken: string,
    updatedById: string
  ): Promise<UserResponseDTO> {
    return await prisma.users.update({
      where: { id },
      data: {
        refreshToken,
        updatedById,
      },
      omit: {
        password: true,
        refreshToken: true,
        isDeleted: true,
        deletedAt: true,
        deletedById: true,
      },
    });
  }

  async recoverPassword(
    id: string,
    data: ResetPasswordDTO,
    updatedById: string
  ): Promise<void> {
    await prisma.users.update({
      where: { id },
      data: {
        password: data.password,
        updatedById,
      },
    });
  }

  async delete(id: string, deletedById: string): Promise<void> {
    await prisma.users.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedById,
        refreshToken: null,
      },
    });

    return;
  }

  async list(page: number, pageSize: number): Promise<UserResponseDTO[]> {
    return await prisma.users.findMany({
      take: pageSize,
      skip: pageSize * page,
      orderBy: { createdAt: "asc" },
      omit: {
        password: true,
        refreshToken: true,
        isDeleted: true,
        deletedAt: true,
        deletedById: true,
      },
      where: {
        isDeleted: false,
      },
    });
  }

  async findById(id: string): Promise<IUser | null> {
    return await prisma.users.findUnique({
      where: { id, isDeleted: false },
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await prisma.users.findFirst({
      where: { email, isDeleted: false },
    });
  }

  async findByNationalId(nationalId: string): Promise<IUser | null> {
    return await prisma.users.findFirst({
      where: { nationalId, isDeleted: false },
    });
  }
}
