const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// All validators return the error text for the user, or undefined if the value is valid.

export function validateEmail(email: string): string | undefined {
  if (!EMAIL_PATTERN.test(email.trim())) {
    return "Enter a valid email address.";
  }
}

// Login only checks for an entry, because the backend decides if the password is correct.
export function validateLoginPassword(password: string): string | undefined {
  if (!password) {
    return "Enter your password.";
  }
}

export function validateNewPassword(password: string): string | undefined {
  if (!password) {
    return "Enter a password.";
  }
  if (password.length < 4) {
    return `At least 4 characters – you entered ${password.length}.`;
  }
}

export function validateFirstname(firstname: string): string | undefined {
  if (!firstname.trim()) {
    return "Enter your first name.";
  }
}

export function validateLastname(lastname: string): string | undefined {
  if (!lastname.trim()) {
    return "Enter your last name.";
  }
}

export function validateAge(age: string): string | undefined {
  const value = Number(age);
  if (!Number.isInteger(value) || value < 1 || value > 120) {
    return "Enter your age as a number.";
  }
}
