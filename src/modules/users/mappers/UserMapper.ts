import { UserResponseDTO } from "../dtos/UserResponseDTO";
import { IUser } from "../interfaces/IUser";

export class UserMapper {
  static toUserResponseDTO(data: IUser): UserResponseDTO {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      nationalId: data.nationalId,
      birthdate: data.birthdate,
      contact: data.contact,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt,
      createdById: data.createdById,
      updatedAt: data.updatedAt,
      updatedById: data.updatedById,
      deletedAt: data.deletedAt,
      deletedById: data.deletedById,
    };
  }
}
