import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  field: string;

  constructor(message: string, field: string) {
    super(message, 404);
    this.field = field;
  }
}
