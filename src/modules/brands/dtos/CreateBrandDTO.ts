import { IsOptional, IsString } from "class-validator";

export class CreateBrandDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  fipeCode?: string;
}
