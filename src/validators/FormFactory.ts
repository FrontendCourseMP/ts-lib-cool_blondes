import { FormValidatorImpl } from "./FormValidatorImpl";

export const formFactory = (formElement: HTMLFormElement) => {
  return new FormValidatorImpl(formElement);
};