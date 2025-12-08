import type { NumberValidator } from "../types/types";

export class NumberValidatorImpl implements NumberValidator{
    min(value: number, message?: string): NumberValidator {
        return new NumberValidatorImpl();
    }

    max(value: number, message?: string): NumberValidator {
        return new NumberValidatorImpl();
    }
    
    required(message?: string): NumberValidator {
        return new NumberValidatorImpl();
    }

    integer(message?: string): NumberValidator {
        return new NumberValidatorImpl();
    }

    positive(message?: string): NumberValidator {
        return new NumberValidatorImpl();
    }
}