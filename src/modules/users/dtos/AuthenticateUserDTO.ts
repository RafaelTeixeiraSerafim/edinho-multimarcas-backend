import { IsEmail, IsString } from "class-validator";

export class AuthenticateUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}