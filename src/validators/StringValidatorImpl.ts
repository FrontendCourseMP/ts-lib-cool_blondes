import { BaseTypedValidator } from "./BaseTypedValidator";
import type { StringValidator } from "../types/types.ts";

export class StringValidatorImpl extends BaseTypedValidator implements StringValidator {
  validate(rawValue: string): string | null {
    if (this.isRequired && (!rawValue || rawValue.trim() === "")) {
      return this.requiredMessage;
    }

    const value = rawValue || "";

    return this.runValidators(value);
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