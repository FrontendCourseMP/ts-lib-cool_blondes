// StringValidatorImpl.ts
import { FieldValidatorImpl } from "./FieldValidatorImpl";
import type { StringValidator, ValidatorFn } from "../types/types";

export class StringValidatorImpl extends FieldValidatorImpl implements StringValidator {
  min(length: number, message?: string): StringValidator {
    const validator: ValidatorFn = (value: string) => {
      if (value && value.length < length) {
        return message || `Minimum length is ${length} characters`;
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  max(length: number, message?: string): StringValidator {
    const validator: ValidatorFn = (value: string) => {
      if (value && value.length > length) {
        return message || `Maximum length is ${length} characters`;
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  email(message?: string): StringValidator {
    const validator: ValidatorFn = (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message || 'Please enter a valid email address';
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  url(message?: string): StringValidator {
    const validator: ValidatorFn = (value: string) => {
      if (value) {
        try {
          new URL(value);
        } catch {
          return message || 'Please enter a valid URL';
        }
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }

  pattern(regex: RegExp, message?: string): StringValidator {
    const validator: ValidatorFn = (value: string) => {
      if (value && !regex.test(value)) {
        return message || 'Please match the requested format';
      }
      return null;
    };
    this.validators.push(validator);
    return this;
  }
}