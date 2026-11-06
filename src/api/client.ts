import axios from "axios";

import { API_URL } from "@/constants/config";
import { getToken } from "@/storage/session";

/** Error of a request, with a message that can be shown to the user directly. */
export class ApiError extends Error {
  /** HTTP status, or null if the server could not be reached. */
  readonly status: number | null;
  /** Original text from the server, e.g. "Email already exists". */
  readonly serverMessage?: string;

  /**
   * @param message - Text for the user, explains what happened and what to do.
   * @param status - HTTP status, or null without a connection.
   * @param serverMessage - Original error text of the backend, if there is one.
   */
  constructor(message: string, status: number | null, serverMessage?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.serverMessage = serverMessage;
  }
}

/**
 * axios instance for the backend. All requests of the app use it.
 * The timeout stops a request after 10 seconds, otherwise a lost connection would keep loading forever.
 */
export const api = axios.create({ baseURL: API_URL, timeout: 10000 });

let unauthorizedHandler: (() => void) | null = null;

/**
 * Defines what happens when the token is invalid or expired.
 * AuthContext registers its logout here, so screens don't have to handle 401 themselves.
 *
 * @param handler - Function that is called on a 401 or 403 answer.
 */
export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

/**
 * Translates a failed request into an ApiError with a message for the user.
 *
 * @param error - Error thrown by axios.
 * @returns ApiError with a readable message and the HTTP status.
 */
function toApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error) || !error.response) {
    return new ApiError("No connection to the server. Check your connection and try again.", null);
  }

  const { status, data } = error.response;
  if (status === 401 || status === 403) {
    unauthorizedHandler?.();
    return new ApiError("Your session has expired. Please log in again.", status);
  }

  if (status === 404) {
    return new ApiError("This entry does not exist anymore. Go back to the list.", status);
  }

  /** json-server-auth returns errors as a JSON string, e.g. "Incorrect password". */
  const serverMessage = typeof data === "string" ? data : undefined;
  return new ApiError("Something went wrong. Please try again.", status, serverMessage);
}

/** Attaches the stored token to every request, so no screen has to do it. */
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Every failed request ends up as an ApiError, so screens only need to show error.message. */
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);
