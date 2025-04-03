import { IFuelType } from "../interfaces/IFuelType";
import { CreateFuelTypeDTO } from "../dtos/CreateFuelTypeDTO";
import { UpdateFuelTypeDTO } from "../dtos/UpdateFuelTypeDTO";
import { FuelTypeResponseDTO } from "../dtos/FuelTypeResponseDTO";

export interface IFuelTypeRepository {
  create(data: CreateFuelTypeDTO, createdById: string): Promise<IFuelType>;
  update(
    id: string,
    data: UpdateFuelTypeDTO,
    updatedById: string
  ): Promise<IFuelType>;
  delete(id: string, deletedById: string): Promise<void>;
  list(page: number, pageSize: number): Promise<FuelTypeResponseDTO[]>;
  findById(id: string): Promise<IFuelType | null>;
  findByName(name: string): Promise<IFuelType | null>;
}
