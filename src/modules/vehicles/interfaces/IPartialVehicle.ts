import { IVehicle } from "./IVehicle";

export interface IPartialVehicle extends Partial<IVehicle> {
  value: number;
  vehicleYear: number;
  referenceMonth: number;
  referenceYear: number;
  modelId: string;
  fuelTypeId: string;
}
