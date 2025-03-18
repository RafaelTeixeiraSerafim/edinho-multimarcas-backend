import { CreateUserDTO } from "@modules/users/dtos/CreateUserDTO";
import { IUser } from "@modules/users/interfaces/IUser";
import { UpdateUserDTO } from "../dtos/UpdateUserDTO";

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<IUser>;
  update(id: string, data: UpdateUserDTO): Promise<IUser>;
  delete(id: string): Promise<void>;
  list(page: number, pageSize: number): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByNationalId(nationalId: string): Promise<IUser | null>;
}
