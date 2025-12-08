// types.ts
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormValidator {
  field(fieldName: string): FieldValidator;
  validate(): ValidationResult;
  validateField(fieldName: string): string | null;
}

export interface FieldValidator {
  string(): StringValidator;
  number(): NumberValidator;
}

export interface TypedValidator {
  required(message?: string): this;
  validate(rawValue: string): string | null;
}

export interface StringValidator extends TypedValidator {
  min(length: number, message?: string): this;
  max(length: number, message?: string): this;
  email(message?: string): this;
  url(message?: string): this;
  pattern(regex: RegExp, message?: string): this;
}

export interface NumberValidator extends TypedValidator {
  min(value: number, message?: string): this;
  max(value: number, message?: string): this;
  integer(message?: string): this;
  positive(message?: string): this;
  negative(message?: string): this;
  range(min: number, max: number, message?: string): this;
}

export type ValidatorFn = (value: unknown) => string | null;
export type FormFactory = (formElement: HTMLFormElement | null) => FormValidator | undefined;