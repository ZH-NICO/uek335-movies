import { ApiError, request } from "@/api/client";
import type { User } from "@/types/user";

export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationData extends Credentials {
  firstname: string;
  lastname: string;
  age: number;
}

// Response of POST /login and POST /register.
export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Logs a user in and returns token and user.
// Throws ApiError with a readable message for wrong credentials or a missing connection.
export async function loginUser(credentials: Credentials): Promise<AuthResponse> {
  try {
    return await request<AuthResponse>("/login", { method: "POST", body: credentials });
  } catch (error) {
    // json-server-auth answers with 400 for an unknown email and for a wrong password.
    if (error instanceof ApiError && error.status === 400) {
      throw new ApiError("Email or password is incorrect. Check your entries and try again.", 400);
    }
    throw error;
  }
}

// Creates a new account. The backend logs the user in right away and returns token and user.
// Throws ApiError with a readable message, e.g. if the email is already taken.
export async function registerUser(data: RegistrationData): Promise<AuthResponse> {
  try {
    return await request<AuthResponse>("/register", { method: "POST", body: data });
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      const message =
        error.serverMessage === "Email already exists"
          ? "An account with this email already exists. Log in instead."
          : "Your entries could not be saved. Check them and try again.";
      throw new ApiError(message, 400, error.serverMessage);
    }
    throw error;
  }
}
