import { UserResponseDTO } from "./UserResponseDTO";

export interface AuthenticateUserResponseDTO {
  token: string;
  refreshToken: string;
  user: UserResponseDTO;
}
