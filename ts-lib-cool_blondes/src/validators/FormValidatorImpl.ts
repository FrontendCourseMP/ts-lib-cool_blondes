import type { FieldValidator, FormValidator, ValidationResult } from "../types/types";
import { FieldValidatorImpl } from "./FieldValidatorImpl";

export class FormValidatorImpl implements FormValidator {
    private form: HTMLFormElement;
    private fields: Record<string, FieldValidator> = {};

    constructor(form: HTMLFormElement) {
        this.form = form;
    }
    
    field(fieldName: string): FieldValidator {
        if (!this.fields[fieldName]) {
            this.fields[fieldName] = new FieldValidatorImpl(fieldName, this.form);
        }
        return this.fields[fieldName];
    }

    validate(): ValidationResult {
        const errors: Record<string, string> = {};
        let isValid = true;

        for (const fieldName in this.fields) {
            const input = this.form.elements.namedItem(fieldName) as HTMLInputElement | null;
            if (!input || (input instanceof HTMLInputElement && input.type !== 'checkbox')) continue;

            const value = input.value

            const fieldValidator = this.fields[fieldName] as FieldValidatorImpl;
            const fieldError = fieldValidator.validate(value);
            if (fieldError) {
                errors[fieldName] = fieldError;
                isValid = false;
            }
        }
        return {errors, isValid}
    }
}