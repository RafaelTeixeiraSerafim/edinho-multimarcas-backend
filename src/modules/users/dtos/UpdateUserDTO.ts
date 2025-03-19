import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  birthdate?: Date;

  @IsOptional()
  contact?: string;

  @IsOptional()
  nationalId?: string;
}
