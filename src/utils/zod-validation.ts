import type { z } from "zod";
import { ValidationError } from "./exceptions/validation-error.exception.js";

export class ZodValidation {
  /**
   * Validates data using a Zod schema and throws a ValidationError if validation fails
   * Format: { fieldName: ["error message 1", "error message 2"] }
   */
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors: Record<string, string[]> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(issue.message);
      });

      throw new ValidationError("Validation failed", errors);
    }

    return result.data;
  }

  /**
   * Safe validation that returns result without throwing
   */
  static safeValidate<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
  ):
    | { success: true; data: T }
    | { success: false; errors: Record<string, string[]> } {
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors: Record<string, string[]> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(issue.message);
      });

      return { success: false, errors };
    }

    return { success: true, data: result.data };
  }
}
