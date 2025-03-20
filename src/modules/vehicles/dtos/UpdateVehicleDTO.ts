import {
  IsOptional,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  Max,
} from "class-validator";

export class UpdateVehicleDTO {
  @IsNumber()
  @Min(0)
  @IsOptional()
  value: number;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  vehicleYear: number;

  @IsString()
  @IsUUID()
  @IsOptional()
  modelId: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  fuelTypeId: string;
}
