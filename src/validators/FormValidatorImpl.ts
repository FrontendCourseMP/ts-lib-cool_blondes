// FormValidatorImpl.ts
import type { FormValidator, FieldValidator, ValidationResult } from "../types/types.ts";
import { FieldValidatorImpl } from "./FieldValidatorImpl";

export class FormValidatorImpl implements FormValidator {
  private form: HTMLFormElement;
  private fieldInstances: Record<string, FieldValidator> = {};

  constructor(form: HTMLFormElement) {
    this.form = form;
  }

  field(fieldName: string): FieldValidator {
    if (!this.fieldInstances[fieldName]) {
      this.fieldInstances[fieldName] = new FieldValidatorImpl();
    }
    return this.fieldInstances[fieldName];
  }

  validateField(fieldName: string): string | null {
    const input = this.form.elements.namedItem(fieldName) as HTMLInputElement | null;
    if (!input || !this.fieldInstances[fieldName]) return null;
    return null;
  }

  validate(): ValidationResult {
    return { isValid: true, errors: {} };
  }
}