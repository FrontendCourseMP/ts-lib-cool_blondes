import { formFactory } from "./validators/FormFactory";

document.addEventListener("DOMContentLoaded", () => {
  const formElement = document.getElementById("userForm") as HTMLFormElement;
  if (!formElement) return;

  const validator = formFactory(formElement);

  validator.field("name").string().email("Введите корректный email");
  validator.field("age")
    .number()
    .required("Это поле обязательно")
    .min(13, "Число должно быть больше 13")
    .max(120, "Число должно быть меньше 120");

  const updateErrors = () => {
    const result = validator.validate();
    const errorFields = ["name", "age"];
    for (const name of errorFields) {
      const errorEl = document.getElementById(`${name}-error`);
      if (errorEl) {
        errorEl.textContent = result.errors[name] || "";
      }
    }
    return result.isValid;
  };

  formElement.addEventListener("input", updateErrors);

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    if (updateErrors()) {
      alert("Форма успешно отправлена!");
    }
  });
});