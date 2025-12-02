export type sum = (a: number, b: number) => number

export type FormFactory = (formElement: HTMLFormElement) => FormValidator;

export interface FormValidator {
  field(fieldName: string): FieldValidator;
  validate(): boolean;
}

export interface FieldValidator {
    string(): StringValidator;
    number(): NumberValidator;
    array(): ArrayValidator;
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

export interface ArrayValidator {
    // Минимальное количество элементов
    minItems(count: number, message?: string): ArrayValidator;
    // Максимальное количество элементов
    maxItems(count: number, message?: string): ArrayValidator;
  
    required(message?: string): ArrayValidator;

}    