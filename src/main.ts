import { formFactory } from "./validators/FormFactory"

document.addEventListener("DOMContentLoaded", () => {
  const formElement = document.getElementById("userForm") as HTMLFormElement | null;
  const validator = formFactory(formElement);

  if (!validator) {
    console.error("Форма не найдена");
    return;
  }

  const nameField = validator.field("name").string().email("Введите корректный email");
  const ageField = validator.field("age").number().
  required("Это поле обязательно").min(13, "Число должно быть больше 13").
  max(120, "Число должно быть меньше 120");

  const fieldValidators = {
    name: nameField,
    age: ageField
  };

  const inputs = formElement?.querySelectorAll("input");
  inputs?.forEach(input => {
    input.addEventListener("input", () => {
      const fieldName = input.name as keyof typeof fieldValidators;
      if (fieldName in fieldValidators) {
        const error = fieldValidators[fieldName].validate(input.value);
        const errorEl = document.getElementById(`${fieldName}-error`);
        if (errorEl) {
          errorEl.textContent = error || "";
        }
      }
    });
  });

  formElement?.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    for (const [fieldName, fieldValidator] of Object.entries(fieldValidators)) {
      const input = formElement.elements.namedItem(fieldName) as HTMLInputElement;
      if (input) {
        const error = fieldValidator.validate(input.value);
        if (error) {
          isValid = false;
        }
      }
    }

    if (isValid) {
      alert("Форма успешно отправлена!");
      // formElement.submit();
    }
  });
});