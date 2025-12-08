// NumberValidatorImpl.ts
import { BaseTypedValidator } from "./BaseTypedValidator";
import type { NumberValidator } from "../types/types.ts";

export class NumberValidatorImpl extends BaseTypedValidator implements NumberValidator {
  validate(rawValue: string): string | null {
    if (this.isRequired && (!rawValue || rawValue.trim() === "")) {
      return this.requiredMessage;
    }

    const num = rawValue === "" ? NaN : Number(rawValue);

    if (!this.isRequired && rawValue === "") {
      return null;
    }

    if (isNaN(num)) {
      return "Please enter a valid number";
    }

    return this.runValidators(num);
  }

  min(value: number, message?: string): this {
    const validator: (num: unknown) => string | null = (num) => {
      if (typeof num === "number" && !isNaN(num) && num < value) {
        return message || `Minimum value is ${value}`;
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  max(value: number, message?: string): this {
    const validator: (num: unknown) => string | null = (num) => {
      if (typeof num === "number" && !isNaN(num) && num > value) {
        return message || `Maximum value is ${value}`;
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  integer(message?: string): this {
    const validator: (num: unknown) => string | null = (num) => {
      if (typeof num === "number" && !isNaN(num) && !Number.isInteger(num)) {
        return message || "Must be an integer";
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  positive(message?: string): this {
    const validator: (num: unknown) => string | null = (num) => {
      if (typeof num === "number" && !isNaN(num) && num <= 0) {
        return message || "Must be a positive number";
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  negative(message?: string): this {
    const validator: (num: unknown) => string | null = (num) => {
      if (typeof num === "number" && !isNaN(num) && num >= 0) {
        return message || "Must be a negative number";
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  range(min: number, max: number, message?: string): this {
    const validator: (num: unknown) => string | null = (num) => {
      if (typeof num === "number" && !isNaN(num) && (num < min || num > max)) {
        return message || `Must be between ${min} and ${max}`;
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }
}