import { describe, it, expect } from 'vitest';
import { formFactory } from '../validators/FormFactory';

function createInput(name: string, value: string = '') {
  const input = document.createElement('input');
  input.name = name;
  input.value = value;
  return input;
}

describe('Field-level validation', () => {
  it('string validator: email invalid', () => {
    const form = document.createElement('form');
    const input = createInput('email', 'not-an-email');
    form.appendChild(input);

    const validator = formFactory(form);
    const emailField = validator.field('email').string().email('Введите корректный email');

    const error = emailField.validate();
    expect(error).toBe('Введите корректный email');
  });

  it('string validator: email valid', () => {
    const form = document.createElement('form');
    const input = createInput('email', 'user@example.com');
    form.appendChild(input);

    const validator = formFactory(form);
    const emailField = validator.field('email').string().email();

    const error = emailField.validate();
    expect(error).toBeNull();
  });

  it('string validator: required empty', () => {
    const form = document.createElement('form');
    const input = createInput('name', '');
    form.appendChild(input);

    const validator = formFactory(form);
    const nameField = validator.field('name').string().required('Обязательное поле');

    const error = nameField.validate();
    expect(error).toBe('Обязательное поле');
  });

  it('string validator: required non-empty', () => {
    const form = document.createElement('form');
    const input = createInput('name', 'Alice');
    form.appendChild(input);

    const validator = formFactory(form);
    const nameField = validator.field('name').string().required();

    const error = nameField.validate();
    expect(error).toBeNull();
  });

  it('number validator: required empty', () => {
    const form = document.createElement('form');
    const input = createInput('age', '');
    form.appendChild(input);

    const validator = formFactory(form);
    const ageField = validator.field('age').number().required('Укажите возраст');

    const error = ageField.validate();
    expect(error).toBe('Укажите возраст');
  });

  it('number validator: min constraint', () => {
    const form = document.createElement('form');
    const input = createInput('age', '10');
    form.appendChild(input);

    const validator = formFactory(form);
    const ageField = validator.field('age').number().min(13, 'Минимум 13 лет');

    const error = ageField.validate();
    expect(error).toBe('Минимум 13 лет');
  });

  it('number validator: max constraint', () => {
    const form = document.createElement('form');
    const input = createInput('age', '150');
    form.appendChild(input);

    const validator = formFactory(form);
    const ageField = validator.field('age').number().max(120, 'Максимум 120 лет');

    const error = ageField.validate();
    expect(error).toBe('Максимум 120 лет');
  });

  it('number validator: integer check', () => {
    const form = document.createElement('form');
    const input = createInput('count', '3.14');
    form.appendChild(input);

    const validator = formFactory(form);
    const countField = validator.field('count').number().integer('Только целые числа');

    const error = countField.validate();
    expect(error).toBe('Только целые числа');
  });

  it('number validator: positive check', () => {
    const form = document.createElement('form');
    const input = createInput('price', '-5');
    form.appendChild(input);

    const validator = formFactory(form);
    const priceField = validator.field('price').number().positive('Цена должна быть положительной');

    const error = priceField.validate();
    expect(error).toBe('Цена должна быть положительной');
  });

  it('number validator: valid number', () => {
    const form = document.createElement('form');
    const input = createInput('age', '25');
    form.appendChild(input);

    const validator = formFactory(form);
    const ageField = validator.field('age')
      .number()
      .required()
      .min(13)
      .max(120)
      .integer();

    const error = ageField.validate();
    expect(error).toBeNull();
  });

  it('combined: multiple fields validation (as in submit handler)', () => {
    const form = document.createElement('form');
    const emailInput = createInput('email', 'bad-email');
    const ageInput = createInput('age', '10');
    form.append(emailInput, ageInput);

    const validator = formFactory(form);
    const emailField = validator.field('email').string().email();
    const ageField = validator.field('age').number().min(13);

    const emailError = emailField.validate();
    const ageError = ageField.validate();
    const isValid = !emailError && !ageError;

    expect(isValid).toBe(false);
    expect(emailError).toBeTruthy();
    expect(ageError).toBeTruthy();

    emailInput.value = 'ok@example.com';
    ageInput.value = '18';

    const emailError2 = emailField.validate();
    const ageError2 = ageField.validate();
    const isValid2 = !emailError2 && !ageError2;

    expect(isValid2).toBe(true);
    expect(emailError2).toBeNull();
    expect(ageError2).toBeNull();
  });

  describe('Field-level validation ', () => {
    it('form-level validation with validator.validate()', () => {
      const form = document.createElement('form');
      const emailInput = createInput('email', 'bad');
      const ageInput = createInput('age', '10');
      form.append(emailInput, ageInput);

      const validator = formFactory(form);

      validator.field('email').string().email('Неверный email');
      validator.field('age').number().min(18, 'Минимум 18 лет');

      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Неверный email');
      expect(result.errors.age).toBe('Минимум 18 лет');
    });
  });
});