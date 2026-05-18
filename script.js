const form = document.querySelector("#signup-form");
const successMessage = document.querySelector("#success-message");

const fields = {
  name: document.querySelector("#name"),
  email: document.querySelector("#email"),
  password: document.querySelector("#password"),
  confirmPassword: document.querySelector("#confirm-password"),
  terms: document.querySelector("#terms"),
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const getFieldContainer = (input) => input.closest(".field");

const setFieldState = (input, message) => {
  const container = getFieldContainer(input);
  const messageElement = document.querySelector(`#${input.id}-error`);

  if (!container || !messageElement) return;

  const hasValue = input.value.trim().length > 0;
  container.classList.toggle("is-invalid", Boolean(message));
  container.classList.toggle("is-valid", !message && hasValue);
  input.setAttribute("aria-invalid", String(Boolean(message)));
  messageElement.textContent = message;
};

const scorePassword = (password) => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return score;
};

const updatePasswordStrength = () => {
  const strength = document.querySelector(".strength");
  const score = fields.password.value ? scorePassword(fields.password.value) : 0;
  strength.dataset.score = String(score);
};

const validateField = (name) => {
  const input = fields[name];
  const value = input.type === "checkbox" ? input.checked : input.value.trim();
  let message = "";

  if (name === "name" && !value) {
    message = "Full name is required.";
  }

  if (name === "email") {
    if (!value) message = "Email address is required.";
    else if (!emailPattern.test(value)) message = "Enter a valid email address.";
  }

  if (name === "password") {
    const score = scorePassword(input.value);
    if (!input.value) message = "Password is required.";
    else if (score < 4) message = "Use 8+ characters with uppercase, lowercase, a number, and a symbol.";
  }

  if (name === "confirmPassword") {
    if (!input.value) message = "Please confirm your password.";
    else if (input.value !== fields.password.value) message = "Passwords do not match.";
  }

  if (name === "terms" && !value) {
    message = "You must agree before creating an account.";
  }

  if (name === "terms") {
    const row = document.querySelector(".check-row");
    row.classList.toggle("is-invalid", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
    document.querySelector("#terms-error").textContent = message;
    return !message;
  }

  setFieldState(input, message);

  if (name === "password" && fields.confirmPassword.value) {
    validateField("confirmPassword");
  }

  return !message;
};

Object.entries(fields).forEach(([name, input]) => {
  input.addEventListener("focus", () => {
    getFieldContainer(input)?.classList.add("is-focused");
    successMessage.textContent = "";
  });

  input.addEventListener("blur", () => {
    getFieldContainer(input)?.classList.remove("is-focused");
    validateField(name);
  });

  input.addEventListener(input.type === "checkbox" ? "change" : "input", () => {
    if (name === "password") updatePasswordStrength();
    validateField(name);
    successMessage.textContent = "";
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const isValid = Object.keys(fields).map(validateField).every(Boolean);

  if (!isValid) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    successMessage.textContent = "";
    return;
  }

  form.reset();
  updatePasswordStrength();
  document.querySelectorAll(".is-valid").forEach((field) => field.classList.remove("is-valid"));
  successMessage.textContent = "Account form completed successfully.";
});
