import { IUser } from "@modules/users/interfaces/IUser";

declare global {
  namespace Express {
    export interface Request {
      user: IUser
    }
  }
}
