import { BaseTypedValidator } from "./BaseTypedValidator.ts";
import type { StringValidator } from "../types/types.ts";

export class StringValidatorImpl extends BaseTypedValidator implements StringValidator {
  private field: HTMLInputElement;

  constructor(field: HTMLInputElement) {
    super();
    this.field = field;
  }

  validate(): string | null {
    const rawValue = this.field.value;

    if (this.isRequired && (rawValue === "" || rawValue == null)) {
      return this.requiredMessage;
    }

    if (rawValue === "") return null;

    return this.runValidators(rawValue);
  }

  min(length: number, message?: string): this {
    const validator: (value: unknown) => string | null = (value) => {
      if (typeof value === "string" && value.length < length) {
        return message || `Minimum length is ${length} characters`;
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  max(length: number, message?: string): this {
    const validator: (value: unknown) => string | null = (value) => {
      if (typeof value === "string" && value.length > length) {
        return message || `Maximum length is ${length} characters`;
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  email(message?: string): this {
    const validator: (value: unknown) => string | null = (value) => {
      if (typeof value === "string" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message || "Please enter a valid email address";
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  url(message?: string): this {
    const validator: (value: unknown) => string | null = (value) => {
      if (typeof value === "string" && value) {
        try {
          new URL(value);
        } catch {
          return message || "Please enter a valid URL";
        }
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  pattern(regex: RegExp, message?: string): this {
    const validator: (value: unknown) => string | null = (value) => {
      if (typeof value === "string" && value && !regex.test(value)) {
        return message || "Please match the requested format";
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }
}