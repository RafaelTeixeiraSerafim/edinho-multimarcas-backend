import { IFuelType } from "../interfaces/IFuelType";
import { CreateFuelTypeDTO } from "../dtos/CreateFuelTypeDTO";

export interface IFuelTypeRepository {
  create(data: CreateFuelTypeDTO, createdById: string): Promise<IFuelType>;
  findByName(name: string): Promise<IFuelType | null>;
  // update(id: string, data: UpdateUserDTO, updatedById: string): Promise<IUser>;
  // delete(id: string, deletedById: string): Promise<void>;
  // list(page: number, pageSize: number): Promise<UserResponseDTO[]>;
  // findById(id: string): Promise<IUser | null>;
  // findByEmail(email: string): Promise<IUser | null>;
  // findByNationalId(nationalId: string): Promise<IUser | null>;
}
