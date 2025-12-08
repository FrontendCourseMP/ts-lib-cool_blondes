/* eslint-disable @typescript-eslint/no-explicit-any */
// FormValidatorImpl.ts
import type { FieldValidator, FormValidator, ValidationResult } from "../types/types";
import { FieldValidatorImpl } from "./FieldValidatorImpl";

export class FormValidatorImpl implements FormValidator {
  private form: HTMLFormElement;
  private fields: Record<string, FieldValidator> = {};

  constructor(form: HTMLFormElement) {
    this.form = form;
    this.initializeFormEvents();
  }
  
  field(fieldName: string): FieldValidator {
    if (!this.fields[fieldName]) {
      this.fields[fieldName] = new FieldValidatorImpl(fieldName, this.form);
    }
    return this.fields[fieldName];
  }

  private initializeFormEvents(): void {
    // Валидация при вводе
    this.form.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.name && this.fields[target.name]) {
        this.validateField(target.name);
      }
    });

    // Валидация при потере фокуса
    this.form.addEventListener('blur', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.name && this.fields[target.name]) {
        this.validateField(target.name);
      }
    }, true);

    // Обработка нативной валидации
    this.form.addEventListener('invalid', (e) => {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      if (target.name && this.fields[target.name]) {
        this.validateField(target.name);
      }
    }, true);
  }

  validateField(fieldName: string): string | null {
    const field = this.form.elements.namedItem(fieldName) as HTMLInputElement;
    if (!field) return null;

    const fieldValidator = this.fields[fieldName] as FieldValidatorImpl;
    if (!fieldValidator) return null;

    const error = fieldValidator.validate(field.value);
    return error;
  }

  validate(): ValidationResult {
    const errors: Record<string, string> = {};
    let isValid = true;

    for (const fieldName in this.fields) {
      const field = this.form.elements.namedItem(fieldName) as HTMLInputElement;
      if (!field) continue;

      const fieldValidator = this.fields[fieldName] as FieldValidatorImpl;
      const error = fieldValidator.validate(field.value);
      
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }

    return { errors, isValid };
  }

  // Метод для использования стандартных атрибутов HTML5
  useNativeConstraints(): void {
    for (const fieldName in this.fields) {
      const field = this.form.elements.namedItem(fieldName) as HTMLInputElement;
      if (!field) continue;

      const fieldValidator = this.fields[fieldName] as FieldValidatorImpl;

      // Используем стандартные атрибуты
      if (field.required) {
        fieldValidator.required(field.validationMessage);
      }

      if (field.min) {
        fieldValidator.addValidator((value: any) => {
          if (value < Number(field.min)) {
            return field.validationMessage || `Minimum value is ${field.min}`;
          }
          return null;
        });
      }

      if (field.max) {
        fieldValidator.addValidator((value: any) => {
          if (value > Number(field.max)) {
            return field.validationMessage || `Maximum value is ${field.max}`;
          }
          return null;
        });
      }

      if (field.pattern) {
        fieldValidator.addValidator((value: any) => {
          if (value && !new RegExp(field.pattern).test(value)) {
            return field.validationMessage || 'Please match the requested format';
          }
          return null;
        });
      }
    }
  }
}