import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateModelDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  fipeCode?: string;

  @IsString()
  @IsUUID()
  brandId: string;
}
