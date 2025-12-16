import { describe, it, expect } from 'vitest';
import { formFactory } from '../validators/FormFactory';

describe('Field-level validation (as used in app)', () => {
  const fakeForm = document.createElement('form');
  const validator = formFactory(fakeForm);

  it('string validator: email invalid', () => {
    const emailField = validator.field('email').string().email('Введите корректный email');
    
    const error = emailField.validate('not-an-email');
    expect(error).toBe('Введите корректный email');
  });

  it('string validator: email valid', () => {
    const emailField = validator.field('email').string().email();
    
    const error = emailField.validate('user@example.com');
    expect(error).toBeNull();
  });

  it('string validator: required empty', () => {
    const nameField = validator.field('name').string().required('Обязательное поле');
    
    const error = nameField.validate('');
    expect(error).toBe('Обязательное поле');
  });

  it('string validator: required non-empty', () => {
    const nameField = validator.field('name').string().required();
    
    const error = nameField.validate('Alice');
    expect(error).toBeNull();
  });

  it('number validator: required empty', () => {
    const ageField = validator.field('age').number().required('Укажите возраст');
    
    const error = ageField.validate('');
    expect(error).toBe('Укажите возраст');
  });

  it('number validator: min constraint', () => {
    const ageField = validator.field('age').number().min(13, 'Минимум 13 лет');
    
    const error = ageField.validate('10');
    expect(error).toBe('Минимум 13 лет');
  });

  it('number validator: max constraint', () => {
    const ageField = validator.field('age').number().max(120, 'Максимум 120 лет');
    
    const error = ageField.validate('150');
    expect(error).toBe('Максимум 120 лет');
  });

  it('number validator: integer check', () => {
    const countField = validator.field('count').number().integer('Только целые числа');
    
    const error = countField.validate('3.14');
    expect(error).toBe('Только целые числа');
  });

  it('number validator: positive check', () => {
    const priceField = validator.field('price').number().positive('Цена должна быть положительной');
    
    const error = priceField.validate('-5');
    expect(error).toBe('Цена должна быть положительной');
  });

  it('number validator: valid number', () => {
    const ageField = validator.field('age')
      .number()
      .required()
      .min(13)
      .max(120)
      .integer();

    const error = ageField.validate('25');
    expect(error).toBeNull();
  });

  it('combined: multiple fields validation (as in submit handler)', () => {
    const emailField = validator.field('email').string().email();
    const ageField = validator.field('age').number().min(13);

    const fields = { email: emailField, age: ageField };

    let isValid = true;
    const errors = {};

    errors.email = fields.email.validate('bad-email');
    errors.age = fields.age.validate('10');

    if (errors.email || errors.age) isValid = false;

    expect(isValid).toBe(false);
    expect(errors.email).toBeTruthy();
    expect(errors.age).toBeTruthy();

    errors.email = fields.email.validate('ok@example.com');
    errors.age = fields.age.validate('18');
    isValid = !(errors.email || errors.age);

    expect(isValid).toBe(true);
    expect(errors.email).toBeNull();
    expect(errors.age).toBeNull();
  });
});