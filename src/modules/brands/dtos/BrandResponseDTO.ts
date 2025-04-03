import { IBrand } from "../interfaces/IBrand";

export interface BrandResponseDTO
  extends Omit<IBrand, "deletedAt" | "deletedById" | "isDeleted"> {}
