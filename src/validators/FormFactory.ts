import { FormValidatorImpl } from "./FormValidatorImpl";

export const formFactory = (formElement: HTMLFormElement | null) => {
  if (!formElement) return undefined;
  return new FormValidatorImpl(formElement);
};