import type { StringValidator } from "../types/types";

export class StringValidatorImpl implements StringValidator {
    min(length: number, message?: string): StringValidator {
        return new StringValidatorImpl();
    }
    max(length: number, message?: string): StringValidator {
        return new StringValidatorImpl();
    }
    required(message?: string): StringValidator {
        return new StringValidatorImpl();
    }
    email(message?: string): StringValidator {
        return new StringValidatorImpl();
    }
    url(message?: string): StringValidator {
        return new StringValidatorImpl();
    }
}

