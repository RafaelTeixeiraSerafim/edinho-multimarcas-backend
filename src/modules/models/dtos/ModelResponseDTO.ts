import { IModel } from "../interfaces/IModel";

export interface ModelResponseDTO
  extends Omit<IModel, "deletedAt" | "deletedById" | "isDeleted"> {}
