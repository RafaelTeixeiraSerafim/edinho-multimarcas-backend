import { UserResponseDTO } from "./UserResponseDTO";
import { IsString, IsNumber, ValidateNested } from "class-validator";

export class AuthenticateUserResponseDTO {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsNumber()
  tokenExpiry: number;

  @ValidateNested({ each: true })
  user: UserResponseDTO;
}
