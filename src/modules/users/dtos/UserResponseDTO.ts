import { IUser } from "../interfaces/IUser";
import { IsString, IsDate, IsOptional, IsEmail } from "class-validator";

interface IUserResponse
  extends Omit<
    IUser,
    "password" | "refreshToken" | "isDeleted" | "deletedAt" | "deletedById"
  > {}

export class UserResponseDTO implements IUserResponse {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsDate()
  birthdate: Date | null;

  @IsOptional()
  @IsString()
  contact: string | null;

  @IsOptional()
  @IsString()
  nationalId: string | null;

  @IsEmail()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsString()
  createdById: string | null;

  @IsOptional()
  @IsString()
  updatedById: string | null;
}
