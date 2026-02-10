import { ClientError } from "./client-error.exception.js";

export class InvariantError extends ClientError {
  constructor(message: string) {
    super(message);
    this.name = "Invariant Error";
  }
}
