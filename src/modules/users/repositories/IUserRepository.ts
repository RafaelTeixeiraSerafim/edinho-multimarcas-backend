import { CreateUserDTO } from "@modules/users/dtos/CreateUserDTO";
import { IUser } from "@modules/users/interfaces/IUser";
import { UpdateUserDTO } from "../dtos/UpdateUserDTO";
import { UserResponseDTO } from "../dtos/UserResponseDTO";
import { ResetPasswordDTO } from "../dtos/RecoverPasswordDTO";

export interface IUserRepository {
  create(data: CreateUserDTO, createdById?: string): Promise<UserResponseDTO>;
  update(
    id: string,
    data: UpdateUserDTO,
    updatedById: string
  ): Promise<UserResponseDTO>;
  refreshToken(
    id: string,
    refreshToken: string,
    updatedById: string
  ): Promise<UserResponseDTO>;
  recoverPassword(
    id: string,
    data: ResetPasswordDTO,
    updatedById: string
  ): Promise<void>;
  delete(id: string, deletedById: string): Promise<void>;
  list(page: number, pageSize: number): Promise<UserResponseDTO[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByNationalId(nationalId: string): Promise<IUser | null>;
}
