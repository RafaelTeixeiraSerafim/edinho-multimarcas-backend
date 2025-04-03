import { IFuelType } from "../interfaces/IFuelType";

export interface FuelTypeResponseDTO
  extends Omit<IFuelType, "deletedAt" | "deletedById" | "isDeleted"> {}
