// FieldValidatorImpl.ts
import { StringValidatorImpl } from "./StringValidatorImpl";
import { NumberValidatorImpl } from "./NumberValidatorImpl";
import type { FieldValidator, StringValidator, NumberValidator } from "../types/types.ts";

export class FieldValidatorImpl implements FieldValidator {
  string(): StringValidator {
    return new StringValidatorImpl();
  }

  number(): NumberValidator {
    return new NumberValidatorImpl();
  }
}