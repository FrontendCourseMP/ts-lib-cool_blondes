// NumberValidatorImpl.ts
import { FieldValidatorImpl } from "./FieldValidatorImpl";
import type { NumberValidator, ValidatorFn } from "../types/types";

export class NumberValidatorImpl extends FieldValidatorImpl implements NumberValidator {
  min(minValue: number, message?: string): NumberValidator {
    const validator: ValidatorFn = (value: number) => {
      if (!isNaN(value) && value < minValue) {
        return message || `Minimum value is ${minValue}`;
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  max(maxValue: number, message?: string): NumberValidator {
    const validator: ValidatorFn = (value: number) => {
      if (!isNaN(value) && value > maxValue) {
        return message || `Maximum value is ${maxValue}`;
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  integer(message?: string): NumberValidator {
    const validator: ValidatorFn = (value: number) => {
      if (!isNaN(value) && !Number.isInteger(value)) {
        return message || 'Must be an integer';
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  positive(message?: string): NumberValidator {
    const validator: ValidatorFn = (value: number) => {
      if (!isNaN(value) && value <= 0) {
        return message || 'Must be a positive number';
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  negative(message?: string): NumberValidator {
    const validator: ValidatorFn = (value: number) => {
      if (!isNaN(value) && value >= 0) {
        return message || 'Must be a negative number';
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  range(min: number, max: number, message?: string): NumberValidator {
    const validator: ValidatorFn = (value: number) => {
      if (!isNaN(value) && (value < min || value > max)) {
        return message || `Must be between ${min} and ${max}`;
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }
}