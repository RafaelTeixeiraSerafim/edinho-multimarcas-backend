import { IsOptional, IsString } from "class-validator";

export class UpdateBrandDTO {
  @IsString()
  name: string;
}
