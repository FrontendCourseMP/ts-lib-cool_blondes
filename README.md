# Библиотека валидации форм ts-cool-validation
Легковесная TypeScript библиотека для валидации HTML-форм с цепным API.

### Требования
- Браузерная среда (ES модули)
- TypeScript
- Форма должна существовать в DOM на момент инициализации

### Установка
html:
```
<form id="userForm">
  <input name="email" type="email" />
  <div id="email-error" class="error"></div>

  <input name="age" type="number" />
  <div id="age-error" class="error"></div>

  <button type="submit">Отправить</button>
</form>
```

JavaScript/TypeScript:
```
import { formFactory } from 'web-form-validator';

const validator = formFactory(document.getElementById('userForm')!);

validator
  .field('email').string().required().email()
  .field('age').number().required().min(13).max(120);

document.getElementById('userForm')!.addEventListener('submit', (e) => {
  e.preventDefault();
  const result = validator.validate();

  if (result.isValid) {
    alert('Форма валидна!');
  } else {
    for (const [field, message] of Object.entries(result.errors)) {
      const errorEl = document.getElementById(`${field}-error`);
      if (errorEl) errorEl.textContent = message;
    }
  }
});
```

--- 

### API
```formFactory(formElement: HTMLFormElement | null)```
Создает валидатор формы. Возвращает undefined, если форма не найдена.

```validator.field(fieldName: string)```
Начинает описание валидации для поля с указанным name.

Возвращает FieldValidator, у которого можно выбрать тип:

####  ```.string() → StringValidator```

- ```.required(message?: string)``` - помечает поле как обязательное

- ```.min(length: number, message?: string)``` - минимальная длина

- ```.max(length: number, message?: string)``` - максимальная длина

- ```.email(message?: string)``` - проверка email формата

- ```.url(message?: string)``` - проверка URL формата

- ```.pattern(regex: RegExp, message?: string)``` - проверка по регулярному выражению

#### ```.number() → NumberValidator```

- ```.min(value: number, message?: string)``` - минимальное значение

- ```.max(value: number, message?: string)``` - максимальное значение

- ```.integer(message?: string)``` - только целые числа

- ```.positive(message?: string)``` - только положительные числа

- ```.negative(message?: string)``` - только отрицательные числа

- ```.range(min: number, max: number, message?: string)``` - диапазон значений

> Все методы возвращают ```this``` — можно строить цепочки.

#### Два способа валидации

##### 1. Валидация всей формы — validator.validate()

Проверяет все зарегистрированные поля и возвращает полный отчёт.
```
const result = validator.validate();
// {
//   isValid: false,
//   errors: {
//     email: "Неверный email",
//     age: "Минимум 13 лет"
//   }
// }
```
> ✅ Используется при отправке формы.  
🔑 Работает, потому что FormValidator сохраняет все созданные валидаторы полей.

##### 2. Валидация отдельного поля — fieldValidator.validate()

Каждый валидатор, возвращённый из ```field()```, имеет метод ```.validate()```, который проверяет только своё поле:
```
const emailValidator = validator.field('email').string().email();
// ...
const error = emailValidator.validate(); // ← возвращает строку или null
```
> ✅ Используется для живой валидации (например, при input event).  
🔑 Не требует передачи значения — поле привязано к HTMLInputElement внутри.

#### Пример комбинированной валидации
```
const validator = formFactory(form);

// Сохраняем ссылки на валидаторы (опционально)
const emailField = validator.field('email').string().email();
const ageField = validator.field('age').number().min(13);

// Живая валидация — через отдельные валидаторы
emailInput.addEventListener('input', () => {
  const error = emailField.validate();
  emailErrorEl.textContent = error || '';
});

// Отправка — через общую валидацию
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const result = validator.validate(); // ← проверяет и email, и age
  if (result.isValid) { /* отправить */ }
});
```