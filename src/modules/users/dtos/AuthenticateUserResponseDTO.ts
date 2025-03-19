import { UserResponseDTO } from "./UserResponseDTO";

export interface AuthenticateUserResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDTO;
}
