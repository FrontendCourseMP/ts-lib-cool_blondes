import type { FormValidator, FieldValidator, ValidationResult } from "../types/types.ts";
import { FieldValidatorImpl } from "./FieldValidatorImpl.ts";

export class FormValidatorImpl implements FormValidator {
  private form: HTMLFormElement;
  private fieldInstances: Record<string, FieldValidator> = {};

  constructor(form: HTMLFormElement) {
    this.form = form;
  }

  field(fieldName: string): FieldValidator {
    const input = this.form.elements.namedItem(fieldName) as HTMLInputElement | null;
    if (!input) {
      throw new Error(`Input with name="${fieldName}" not found in form`);
    }

    if (!this.fieldInstances[fieldName]) {
      this.fieldInstances[fieldName] = new FieldValidatorImpl(input);
    }

    return this.fieldInstances[fieldName];
  }

  validate(): ValidationResult {
    const errors: Record<string, string> = {};
    let isValid = true;

    for (const fieldName in this.fieldInstances) {
      const error = this.fieldInstances[fieldName].validate();
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }

    return { isValid, errors };
  }
}