import { IsDate, IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsDate()
  @IsOptional()
  birthdate?: Date;

  @IsOptional()
  contact?: string;

  @IsOptional()
  nationalId?: string;

  @IsString()
  @IsUUID()
  createdById: string;
}
