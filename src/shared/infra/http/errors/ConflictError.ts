import { CustomError } from "./CustomError";

export class ConflictError extends CustomError {
  field: string;

  constructor(message: string, field: string) {
    super(message, 409);
    this.field = field;
  }
}
