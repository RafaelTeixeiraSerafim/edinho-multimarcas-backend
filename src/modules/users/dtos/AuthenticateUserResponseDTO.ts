import { UserResponseDTO } from "./UserResponseDTO";

export interface AuthenticateUserResponseDTO {
  accessToken: string;
  refreshToken: string;
  tokenExpiry: number;
  user: UserResponseDTO;
}
