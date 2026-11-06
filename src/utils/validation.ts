const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks the email format before it is sent to the backend.
 *
 * @param email - Entered email.
 * @returns Error text for the user, or undefined if the email is valid.
 */
export function validateEmail(email: string): string | undefined {
  if (!EMAIL_PATTERN.test(email.trim())) {
    return "Enter a valid email address.";
  }
}

/**
 * Login only checks for an entry, because the backend decides if the password is correct.
 *
 * @param password - Entered password.
 * @returns Error text, or undefined if a password was entered.
 */
export function validateLoginPassword(password: string): string | undefined {
  if (!password) {
    return "Enter your password.";
  }
}

/**
 * Checks a new password against the rule of json-server-auth (at least 4 characters).
 *
 * @param password - Entered password.
 * @returns Error text with the entered length, or undefined if the password is valid.
 */
export function validateNewPassword(password: string): string | undefined {
  if (!password) {
    return "Enter a password.";
  }
  if (password.length < 4) {
    return `At least 4 characters – you entered ${password.length}.`;
  }
}

/**
 * @param firstname - Entered first name.
 * @returns Error text, or undefined if the field is not empty.
 */
export function validateFirstname(firstname: string): string | undefined {
  if (!firstname.trim()) {
    return "Enter your first name.";
  }
}

/**
 * @param lastname - Entered last name.
 * @returns Error text, or undefined if the field is not empty.
 */
export function validateLastname(lastname: string): string | undefined {
  if (!lastname.trim()) {
    return "Enter your last name.";
  }
}

/**
 * @param age - Entered age as text from the input field.
 * @returns Error text, or undefined if it is a whole number from 1 to 120.
 */
export function validateAge(age: string): string | undefined {
  const value = Number(age);
  if (!Number.isInteger(value) || value < 1 || value > 120) {
    return "Enter your age as a number.";
  }
}
