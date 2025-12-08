// src/main.ts
import { FormValidatorImpl } from './validators/FormValidatorImpl';
import type { FormFactory } from './types/types';

// Фабричная функция
export const form: FormFactory = (formElement: HTMLFormElement) => {
  const validator = new FormValidatorImpl(formElement);
  return validator;
};

// Экспортируем типы
export type { 
  FormValidator, 
  FieldValidator, 
  StringValidator, 
  NumberValidator,
  ValidationResult 
} from './types/types';

// Экспортируем реализации (для отладки)
export { FormValidatorImpl } from './validators/FormValidatorImpl';
export { FieldValidatorImpl } from './validators/FieldValidatorImpl';