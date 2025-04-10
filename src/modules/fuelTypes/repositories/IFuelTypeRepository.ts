import { IFuelType } from "../interfaces/IFuelType";
import { CreateFuelTypeDTO } from "../dtos/CreateFuelTypeDTO";
import { UpdateFuelTypeDTO } from "../dtos/UpdateFuelTypeDTO";
import { FuelTypeResponseDTO } from "../dtos/FuelTypeResponseDTO";
import { ListResponseDTO } from "@shared/dtos/ListResponseDTO";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

export interface IFuelTypeRepository {
  create(data: CreateFuelTypeDTO, createdById: string): Promise<IFuelType>;
  update(
    id: string,
    data: UpdateFuelTypeDTO,
    updatedById: string
  ): Promise<IFuelType>;
  delete(id: string, deletedById: string): Promise<void>;
  list(
    params: PaginationQueryDTO
  ): Promise<ListResponseDTO<FuelTypeResponseDTO>>;
  findById(id: string): Promise<IFuelType | null>;
  findByName(name: string): Promise<IFuelType | null>;
}
