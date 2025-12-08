export type sum = (a: number, b: number) => number

export type FormFactory = (formElement: HTMLFormElement) => FormValidator;

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormValidator {
  field(fieldName: string): FieldValidator;
  validate(): ValidationResult;
}

export interface FieldValidator {
    string(): StringValidator;
    number(): NumberValidator;
    required(message?: string): FieldValidator;
}    

export interface StringValidator {
    min(length: number, message?: string): StringValidator;
    max(length: number, message?: string): StringValidator;
    required(message?: string): StringValidator;
    email(message?: string): StringValidator;
    url(message?: string): StringValidator;
}    

export interface NumberValidator {
    min(value: number, message?: string): NumberValidator;
    max(value: number, message?: string): NumberValidator;
    required(message?: string): NumberValidator;

    // Проверка на целое число ?
    integer(message?: string): NumberValidator;

    // Проверка на положительное число ?
    positive(message?: string): NumberValidator;
}    