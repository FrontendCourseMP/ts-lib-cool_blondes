import { FormValidatorImpl } from './FormValidatorImpl';
import type { FormFactory } from '../types/types';

// eslint-disable-next-line arrow-body-style
export const createFormValidator: FormFactory = (formElement: HTMLFormElement) => {

    return new FormValidatorImpl(formElement);
};