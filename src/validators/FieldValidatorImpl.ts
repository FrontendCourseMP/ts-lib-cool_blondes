// FieldValidatorImpl.ts
import { StringValidatorImpl } from "./StringValidatorImpl";
import { NumberValidatorImpl } from "./NumberValidatorImpl";
import type { FieldValidator, StringValidator, NumberValidator } from "../types/types.ts";

export class FieldValidatorImpl implements FieldValidator {
  private field: HTMLInputElement;
  private validator: NumberValidator | StringValidator | null = null;

  constructor(field: HTMLInputElement) {
    this.field = field;
  }

  string(): StringValidator {
    this.validator = new StringValidatorImpl(this.field);
    return this.validator;
  }

  number(): NumberValidator {
    this.validator = new NumberValidatorImpl(this.field);
    return this.validator;
  }

  validate(): string | null {
    if (!this.validator) {
      throw new Error("Call .string() or .number() before validate()");
    }
    return this.validator.validate();
  }
}