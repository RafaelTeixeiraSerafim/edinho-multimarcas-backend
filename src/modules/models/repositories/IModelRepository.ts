import { CreateModelDTO } from "../dtos/CreateModelDTO";
import { UpdateModelDTO } from "../dtos/UpdateModelDTO";
import { IModel } from "../interfaces/IModel";

export interface IModelRepository {
  create(data: CreateModelDTO, createdById: string): Promise<IModel>;
  update(
    id: string,
    data: UpdateModelDTO,
    updatedById: string
  ): Promise<IModel>;
  list(page: number, pageSize: number): Promise<IModel[]>;
  delete(id: string, deletedById: string): Promise<void>;
  findById(id: string): Promise<IModel | null>;
  findByBrandId(brandId: string): Promise<IModel[]>;
  findByName(name: string): Promise<IModel | null>;
}
