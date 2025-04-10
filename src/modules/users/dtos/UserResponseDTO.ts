import { IUser } from "../interfaces/IUser";

export interface UserResponseDTO
  extends Omit<
    IUser,
    "password" | "refreshToken" | "isDeleted" | "deletedAt" | "deletedById"
  > {}
