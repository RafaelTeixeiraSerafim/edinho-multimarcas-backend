import { IsString } from "class-validator";

export class CreateFuelTypeDTO {
  @IsString()
  name: string;

  @IsString()
  abbreviation: string;
}
