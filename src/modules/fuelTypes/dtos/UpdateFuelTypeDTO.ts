import { IsOptional, IsString } from "class-validator";

export class UpdateFuelTypeDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  abbreviation?: string;
}
