import { CreateVehicleDTO } from "../dtos/CreateVehicleDTO";
import { UpdateVehicleDTO } from "../dtos/UpdateVehicleDTO";
import { IPartialVehicle } from "../interfaces/IPartialVehicle";
import { IVehicle } from "../interfaces/IVehicle";

export interface IVehicleRepository {
  create(data: CreateVehicleDTO, createdById: string): Promise<IVehicle>;
  delete(id: string, deletedById: string): Promise<void>;
  findByFuelTypeId(fuelTypeId: string): Promise<IVehicle[]>;
  findByModelId(modelId: string): Promise<IVehicle[]>;
  update(
    id: string,
    data: UpdateVehicleDTO,
    updatedById: string
  ): Promise<IVehicle>;
  list(page: number, pageSize: number): Promise<IVehicle[]>;
  findById(id: string): Promise<IVehicle | null>;
  findExistingVehicle(data: IPartialVehicle): Promise<IVehicle | null>;
}
