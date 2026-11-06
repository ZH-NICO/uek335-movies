const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const RELEASE_DATE_PATTERN = /^([A-Z][a-z]{2}) (\d{2}) (\d{4})$/;

/**
 * Reads a number from a text field. Many phone keyboards in Switzerland only offer a comma.
 *
 * @param value - Text of the field, e.g. "8,8".
 * @returns The number, or NaN if the text is not a number.
 */
export function parseNumber(value: string): number {
  return Number(value.trim().replace(",", "."));
}

/**
 * @param title - Text of the title field.
 * @returns Error text for the user, or undefined if the title is valid.
 */
export function validateTitle(title: string): string | undefined {
  if (!title.trim()) {
    return "Enter a title.";
  }
}

/**
 * The list reads the year from the end of the date and the year filter searches in this text,
 * so every movie has to use the same format as the backend.
 *
 * @param releaseDate - Text of the date field.
 * @returns Error text for the user, or undefined if it is a real date like "Sep 03 2009".
 */
export function validateReleaseDate(releaseDate: string): string | undefined {
  const message = "Enter a real date like Sep 03 2009.";
  const match = RELEASE_DATE_PATTERN.exec(releaseDate.trim());
  if (!match) {
    return message;
  }
  const month = MONTHS.indexOf(match[1]);
  const day = Number(match[2]);
  /** JavaScript turns Feb 31 into a day in March, so a changed month means the date does not exist. */
  const date = new Date(Number(match[3]), month, day);
  if (month === -1 || date.getMonth() !== month || date.getDate() !== day) {
    return message;
  }
}

/**
 * @param value - Text of an optional number field. An empty field is valid.
 * @param min - Smallest allowed number.
 * @param max - Largest allowed number.
 * @returns Error text for the user, or undefined if the value is valid.
 */
export function validateNumberInRange(value: string, min: number, max: number): string | undefined {
  if (!value.trim()) {
    return undefined;
  }
  const number = parseNumber(value);
  if (Number.isNaN(number) || number < min || number > max) {
    return `Enter a number from ${min} to ${max}.`;
  }
}

/**
 * @param value - Text of the optional running time field. An empty field is valid.
 * @returns Error text for the user, or undefined if the value is valid.
 */
export function validateRunningTime(value: string): string | undefined {
  if (!value.trim()) {
    return undefined;
  }
  const minutes = parseNumber(value);
  if (!Number.isInteger(minutes) || minutes < 1) {
    return "Enter the running time in whole minutes.";
  }
}
