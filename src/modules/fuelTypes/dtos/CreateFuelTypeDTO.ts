import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateFuelTypeDTO {
  @IsString()
  name: string;

  @IsString()
  abbreviation: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  createdById?: string;
}
