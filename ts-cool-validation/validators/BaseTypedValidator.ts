import type { TypedValidator, ValidatorFn } from "../types/types.ts";

export abstract class BaseTypedValidator implements TypedValidator {
  protected isRequired = false;
  protected requiredMessage = "This field is required";
  protected validators: ValidatorFn[] = [];

  required(message?: string): this {
    this.isRequired = true;
    if (message) this.requiredMessage = message;
    return this;
  }

  protected runValidators(value: unknown): string | null {
    for (const validator of this.validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  }

  abstract validate(): string | null;
}