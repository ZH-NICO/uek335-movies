import { api, ApiError } from "@/api/client";
import type { User } from "@/types/user";

/** Data the user enters to log in. */
export interface Credentials {
  email: string;
  password: string;
}

/** Data the user enters to create an account. */
export interface RegistrationData extends Credentials {
  firstname: string;
  lastname: string;
  age: number;
}

/** Response of POST /login and POST /register. */
export interface AuthResponse {
  accessToken: string;
  user: User;
}

/**
 * Logs a user in.
 *
 * @param credentials - Email and password.
 * @returns Token and user.
 * @throws ApiError with a readable message for wrong credentials or a missing connection.
 */
export async function loginUser(credentials: Credentials): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/login", credentials);
    return data;
  } catch (error) {
    /** json-server-auth answers with 400 for an unknown email and for a wrong password. */
    if (error instanceof ApiError && error.status === 400) {
      throw new ApiError("Email or password is incorrect. Check your entries and try again.", 400);
    }
    throw error;
  }
}

/**
 * Creates a new account. The backend logs the user in right away.
 *
 * @param registration - Email, password, first name, last name and age.
 * @returns Token and the new user.
 * @throws ApiError with a readable message, e.g. if the email is already taken.
 */
export async function registerUser(registration: RegistrationData): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/register", registration);
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.serverMessage === "Email already exists") {
      throw new ApiError("An account with this email already exists. Log in instead.", 400);
    }
    throw error;
  }
}
