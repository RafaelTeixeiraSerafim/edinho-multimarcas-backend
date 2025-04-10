import { ListResponseDTO } from "@shared/dtos/ListResponseDTO";
import { BrandResponseDTO } from "../dtos/BrandResponseDTO";
import { CreateBrandDTO } from "../dtos/CreateBrandDTO";
import { UpdateBrandDTO } from "../dtos/UpdateBrandDTO";
import { IBrand } from "../interfaces/IBrand";
import { PaginationQueryDTO } from "@shared/dtos/PaginationQueryDTO";

export interface IBrandRepository {
  create(data: CreateBrandDTO, createdById: string): Promise<IBrand>;
  update(
    id: string,
    data: UpdateBrandDTO,
    updatedById: string
  ): Promise<IBrand>;
  delete(id: string, deletedById: string): Promise<void>;
  list(params: PaginationQueryDTO): Promise<ListResponseDTO<BrandResponseDTO>>;
  findById(id: string): Promise<IBrand | null>;
  findByName(name: string): Promise<IBrand | null>;
}
