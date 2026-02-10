import { ClientError } from "./client-error.exception.js";

export interface ValidationIssue {
  field: string;
  message: string;
}

export class ValidationError extends ClientError {
  constructor(
    message: string,
    public errors: Record<string, string[]>,
  ) {
    super(message);
    this.name = "Validation Error";
    this.errors = errors;
  }
}
