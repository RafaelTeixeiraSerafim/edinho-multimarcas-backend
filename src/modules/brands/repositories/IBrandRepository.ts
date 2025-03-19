import { CreateBrandDTO } from "../dtos/CreateBrandDTO";
import { IBrand } from "../interfaces/IBrand";

export interface IBrandRepository {
  create(data: CreateBrandDTO, createdById: string): Promise<IBrand>;
}
