Библиотека валидации форм
Легковесная TypeScript библиотека для валидации HTML-форм с цепным API.

Требования
Браузерная среда (ES модули)

TypeScript (рекомендуется) или JavaScript

Форма должна существовать в DOM на момент инициализации

Установка
typescript
// Импортируйте основной модуль
import { formFactory } from './path/to/validators/FormFactory';
Пример
HTML:

html
<form id="userForm">
  <div>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email">
    <span id="email-error" class="error"></span>
  </div>
  
  <div>
    <label for="age">Возраст:</label>
    <input type="number" id="age" name="age">
    <span id="age-error" class="error"></span>
  </div>
  
  <button type="submit">Отправить</button>
</form>
JavaScript/TypeScript:

typescript
import { formFactory } from './validators/FormFactory';

const formElement = document.getElementById('userForm') as HTMLFormElement;
const validator = formFactory(formElement);

// Настройка валидации
const emailValidator = validator.field('email').string()
  .required('Email обязателен')
  .email('Неверный формат email');

const ageValidator = validator.field('age').number()
  .required('Возраст обязателен')
  .min(18, 'Минимум 18 лет')
  .max(120, 'Максимум 120 лет');

// Валидация при вводе
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => {
    const fieldName = input.name;
    let validator;
    
    if (fieldName === 'email') validator = emailValidator;
    if (fieldName === 'age') validator = ageValidator;
    
    if (validator) {
      const error = validator.validate(input.value);
      const errorElement = document.getElementById(`${fieldName}-error`);
      if (errorElement) {
        errorElement.textContent = error || '';
      }
    }
  });
});

// Валидация при отправке
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const emailError = emailValidator.validate(
    (formElement.elements.namedItem('email') as HTMLInputElement).value
  );
  const ageError = ageValidator.validate(
    (formElement.elements.namedItem('age') as HTMLInputElement).value
  );
  
  if (!emailError && !ageError) {
    formElement.submit();
  }
});
API
formFactory(formElement: HTMLFormElement | null)
Создает валидатор формы. Возвращает undefined, если форма не найдена.

validator.field(fieldName: string)
Возвращает валидатор для конкретного поля формы.

Методы валидатора полей:
Для всех типов:

.required(message?: string) - помечает поле как обязательное

.validate(value: string): string | null - валидирует значение, возвращает ошибку или null

StringValidator (валидатор строк):

.string() - создает валидатор для строковых полей

.min(length: number, message?: string) - минимальная длина

.max(length: number, message?: string) - максимальная длина

.email(message?: string) - проверка email формата

.url(message?: string) - проверка URL формата

.pattern(regex: RegExp, message?: string) - проверка по регулярному выражению

NumberValidator (валидатор чисел):

.number() - создает валидатор для числовых полей

.min(value: number, message?: string) - минимальное значение

.max(value: number, message?: string) - максимальное значение

.integer(message?: string) - только целые числа

.positive(message?: string) - только положительные числа

.negative(message?: string) - только отрицательные числа

.range(min: number, max: number, message?: string) - диапазон значений

Особенности реализации
Цепной API - методы можно вызывать цепочкой

Ленивая валидация - проверка происходит только при вызове validate()

Кастомные сообщения - все правила поддерживают собственные сообщения об ошибках

Опциональные поля - если поле не .required(), пустые значения проходят валидацию

Типобезопасность - полная поддержка TypeScript

Ограничения
Поддерживаются только строковые и числовые поля (нет boolean, date, file)

Нет автоматической привязки к событиям формы (нужно вручную добавлять обработчики)

validateField() в FormValidator еще не полностью реализован

Нет встроенной групповой валидации всей формы