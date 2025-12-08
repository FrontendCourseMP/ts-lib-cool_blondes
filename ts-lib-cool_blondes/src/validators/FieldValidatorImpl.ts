import type { FieldValidator, NumberValidator, StringValidator, ValidatorFn } from "../types/types";
import { NumberValidatorImpl } from "./NumberValidatorImpl";
import { StringValidatorImpl } from "./StringValidatorImpl";

export class FieldValidatorImpl implements FieldValidator {
    private fieldName: string;
    private form: HTMLFormElement;
    private type: "string" | "number" | null = null;
    private requiredMessage: string = "Field is required";
    protected validators: ValidatorFn[] = [];
    private customMessages: Map<string, string> = new Map();
    private labelElement: HTMLLabelElement | null = null;
    private hasLabel: boolean = false;
    private errorElement: HTMLElement | null = null;

    constructor(fieldName: string, form: HTMLFormElement) {
        this.fieldName = fieldName;
        this.form = form;
        this.initializeFieldElements();
    }

    private initializeFieldElements(): void {
        
        const field = this.form.elements.namedItem(this.fieldName) as HTMLInputElement;
        if (!field) {
            return;
        }

        // связанный label
        if (field.labels && field.labels.length > 0) {
            this.labelElement = field.labels[0];
            this.hasLabel = true; // Label найден
        } else {
            this.labelElement = this.form.querySelector(`label[for="${field.id}"]`);
            this.hasLabel = !!this.labelElement; // Проверяем, нашли ли label
        }

        // вложенный label
        if (!this.hasLabel) {
            const parentLabel = field.closest('label');
            if (parentLabel) {
                this.labelElement = parentLabel;
                this.hasLabel = true;
            }
        }

        // создаем или находим элемент для ошибок
        this.ensureErrorElement(field);
    }

    private ensureErrorElement(field: HTMLInputElement): void {
        
        const errorId = `${this.fieldName}-error`;
        this.errorElement = document.getElementById(errorId);
        
        if (!this.errorElement) {
            this.errorElement = document.createElement('div');
            this.errorElement.id = errorId;
            this.errorElement.className = 'validation-error';
            this.errorElement.setAttribute('aria-live', 'polite');
            
            field.insertAdjacentElement('afterend', this.errorElement);
        }
    }

    string(): StringValidator {
        this.type = "string";
        const stringValidator = new StringValidatorImpl(this.fieldName, this.form);
        stringValidator.setParent(this);
        return stringValidator;
    }

    number(): NumberValidator {
        this.type = "number";
        const numberValidator = new NumberValidatorImpl(this.fieldName, this.form);
        numberValidator.setParent(this);
        return numberValidator;
    }

     setParent(parent: FieldValidatorImpl): void {
        // Цепочка валидаторов
        this.validators = parent.validators;
        this.customMessages = parent.customMessages;
    }

    required(message: string = "Field is required"): FieldValidator {
        this.requiredMessage = message;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.validators.push((value: any) => {
        const isEmpty = value === '' || value === null || value === undefined ||
            (this.type === 'number' && (isNaN(value) || value === ''));
        
        if (isEmpty) {
            return this.getErrorMessage('required', this.requiredMessage);
        }
        return null;
        });
        
        return this;
    }

    addValidator(fn: ValidatorFn): FieldValidator {
        this.validators.push(fn);
        return this;
    }

    setCustomMessage(key: string, message: string): void {
        this.customMessages.set(key, message);
    }


    private getErrorMessage(key: string, defaultMessage: string): string {
        return this.customMessages.get(key) || defaultMessage;
    }

    validate(rawValue: string): string | null {
        // eslint-disable-next-line no-useless-assignment
        let value: string | number = rawValue;
        
        if (this.type === 'number') {
            value = rawValue === '' ? NaN : Number(rawValue);
        } else {
            value = String(rawValue);
        }

        // Применение всех валидаторов
        for (const validator of this.validators) {
        const error = validator(value);
        if (error) {
            this.showError(error);
            return error;
        }
        }

        this.clearError();
        return null;
    }
    private showError(message: string): void {
        if (this.errorElement) {
        this.errorElement.textContent = message;
        this.errorElement.style.display = 'block';
        
        // aria-invalid на поле
        const field = this.form.elements.namedItem(this.fieldName) as HTMLInputElement;
        if (field) {
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', this.errorElement.id);
        }
        }
    }

    private clearError(): void {
        if (this.errorElement) {
        this.errorElement.textContent = '';
        this.errorElement.style.display = 'none';
        
        const field = this.form.elements.namedItem(this.fieldName) as HTMLInputElement;
        if (field) {
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        }
        }
    }
}