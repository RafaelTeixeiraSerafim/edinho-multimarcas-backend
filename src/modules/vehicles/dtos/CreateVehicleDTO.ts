import { IsOptional, IsNumber, IsString, IsUUID, Min, Max } from "class-validator";

export class CreateVehicleDTO {
  @IsOptional()
  @IsString()
  fipeCode?: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  referenceMonth: number;

  @IsNumber()
  @Min(2000)
  @Max(new Date().getFullYear())
  referenceYear: number;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  vehicleYear: number;

  @IsString()
  @IsUUID()
  modelId: string;

  @IsString()
  @IsUUID()
  fuelTypeId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  createdById?: string;
}
