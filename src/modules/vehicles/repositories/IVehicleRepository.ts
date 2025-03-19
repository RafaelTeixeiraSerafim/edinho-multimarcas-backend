import { CreateVehicleDTO } from "../dtos/CreateVehicleDTO";
import { IVehicle } from "../interfaces/IVehicle";

interface IVehicleRepository {
  create(data: CreateVehicleDTO): Promise<IVehicle>;
  findByFuelTypeId(fuelTypeId: string): Promise<IVehicle[]>;
}

export { IVehicleRepository };
