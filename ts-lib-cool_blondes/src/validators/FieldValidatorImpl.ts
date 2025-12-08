import type { FieldValidator, NumberValidator, StringValidator } from "../types/types";
import { NumberValidatorImpl } from "./NumberValidatorImpl";
import { StringValidatorImpl } from "./StringValidatorImpl";

export class FieldValidatorImpl implements FieldValidator {
    private fieldName: string;
    private form: HTMLFormElement;
    private type: "string" | "number" | null = null;  
    private isRequired: boolean = false;
    private requiredMessage: string = "Field is required"; 

    constructor(fieldName: string, form: HTMLFormElement) {
        this.fieldName = fieldName
        this.form = form
    }

    string(): StringValidator {
        this.type = "string";
        return new StringValidatorImpl();
    }

    number(): NumberValidator {
        this.type = "number";
        return new NumberValidatorImpl();
    }

    required(message: string = "Field is required"): FieldValidator {
        this.isRequired = true;
        this.requiredMessage = message;
        return this;
    }

    validate(rawValue: string): string | null {
        let value: string | number = rawValue;
        if (this.type === 'number') {
            value = rawValue === '' ? NaN : Number(rawValue);
        } else {
            value = String(rawValue);
        }

        const isEmpty = value === '' || value == null ||
        (this.type === 'number' && isNaN(value));

        if (this.isRequired && isEmpty) {
            return this.requiredMessage || 'This field is required';
        }

        if (!isEmpty) {
            for (const validator of this.validators) {
                const error = validator(value);
                if (error) return error;
            }
        }

        return null;
    }
}