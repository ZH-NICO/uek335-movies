import axios from "axios";

import { API_URL } from "@/constants/config";
import { getToken } from "@/storage/session";

// Error of a request, with a message that can be shown to the user directly.
export class ApiError extends Error {
  // HTTP status, or null if the server could not be reached.
  readonly status: number | null;
  // Original text from the server, e.g. "Email already exists".
  readonly serverMessage?: string;

  constructor(message: string, status: number | null, serverMessage?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.serverMessage = serverMessage;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

// Without a time limit, a lost connection would keep loading forever.
const api = axios.create({ baseURL: API_URL, timeout: 10000 });

let unauthorizedHandler: (() => void) | null = null;

// Defines what happens when the token is invalid or expired.
// AuthContext registers its logout here, so screens don't have to handle 401 themselves.
export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

// Sends a request to the backend and attaches the stored token automatically.
// The body is sent as JSON and the JSON response is returned.
// Throws ApiError if there is no connection, the session expired or the server returns an error.
export async function request<T>(path: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
  const token = await getToken();

  try {
    const response = await api.request<T>({
      url: path,
      method,
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response) {
      throw new ApiError("No connection to the server. Check your connection and try again.", null);
    }

    const { status, data } = error.response;
    if (status === 401 || status === 403) {
      unauthorizedHandler?.();
      throw new ApiError("Your session has expired. Please log in again.", status);
    }

    // json-server-auth returns errors as a JSON string, e.g. "Incorrect password".
    throw new ApiError(
      "Something went wrong. Please try again.",
      status,
      typeof data === "string" ? data : undefined,
    );
  }
}
