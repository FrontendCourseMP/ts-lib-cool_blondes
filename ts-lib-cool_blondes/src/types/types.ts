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
  required(message?: string): FieldValidator;
  validate(value: string): string | null;
}    

export interface StringValidator extends FieldValidator {
  min(length: number, message?: string): StringValidator;
  max(length: number, message?: string): StringValidator;
  email(message?: string): StringValidator;
  url(message?: string): StringValidator;
  pattern(regex: RegExp, message?: string): StringValidator;
}    

export interface NumberValidator extends FieldValidator {
  min(value: number, message?: string): NumberValidator;
  max(value: number, message?: string): NumberValidator;
  integer(message?: string): NumberValidator;
  positive(message?: string): NumberValidator;
  negative(message?: string): NumberValidator;
  range(min: number, max: number, message?: string): NumberValidator;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidatorFn = (value: any) => string | null;

export type FormFactory = (formElement: HTMLFormElement) => FormValidator;