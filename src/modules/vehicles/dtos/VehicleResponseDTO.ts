import { FuelTypeResponseDTO } from "@modules/fuelTypes/dtos/FuelTypeResponseDTO";
import { IVehicle } from "../interfaces/IVehicle";

export interface VehicleResponseDTO
  extends Omit<IVehicle, "deletedAt" | "deletedById" | "isDeleted"> {
  fuelType: FuelTypeResponseDTO;
}
