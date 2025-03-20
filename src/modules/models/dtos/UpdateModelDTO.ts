import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateModelDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  brandId: string;
}
