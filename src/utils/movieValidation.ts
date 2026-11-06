const RELEASE_DATE_PATTERN = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (0[1-9]|[12]\d|3[01]) \d{4}$/;

// All validators return the error text for the user, or undefined if the value is valid.

export function validateTitle(title: string): string | undefined {
  if (!title.trim()) {
    return "Enter a title.";
  }
}

// The list reads the year from the end of the date and the year filter searches in this text,
// so every movie has to use the same format as the backend.
export function validateReleaseDate(releaseDate: string): string | undefined {
  if (!RELEASE_DATE_PATTERN.test(releaseDate.trim())) {
    return "Enter the date like Sep 03 2009.";
  }
}

// Optional number between min and max. An empty field is valid.
export function validateNumberInRange(value: string, min: number, max: number): string | undefined {
  if (!value.trim()) {
    return undefined;
  }
  const number = Number(value);
  if (Number.isNaN(number) || number < min || number > max) {
    return `Enter a number from ${min} to ${max}.`;
  }
}

// Optional running time. An empty field is valid.
export function validateRunningTime(value: string): string | undefined {
  if (!value.trim()) {
    return undefined;
  }
  const minutes = Number(value);
  if (!Number.isInteger(minutes) || minutes < 1) {
    return "Enter the running time in whole minutes.";
  }
}
