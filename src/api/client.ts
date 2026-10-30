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

let unauthorizedHandler: (() => void) | null = null;

// Defines what happens when the token is invalid or expired.
// AuthContext registers its logout here, so screens don't have to handle 401 themselves.
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

// Sends a request to the backend and attaches the stored token automatically.
// The body is sent as JSON and the JSON response is returned.
// Throws ApiError if there is no connection, the session expired or the server returns an error.
export async function request<T>(path: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("No connection to the server. Check your connection and try again.", null);
  }

  if (response.status === 401 || response.status === 403) {
    unauthorizedHandler?.();
    throw new ApiError("Your session has expired. Please log in again.", response.status);
  }

  if (!response.ok) {
    // json-server-auth returns errors as a JSON string, e.g. "Incorrect password".
    const serverMessage: unknown = await response.json().catch(() => undefined);
    throw new ApiError(
      "Something went wrong. Please try again.",
      response.status,
      typeof serverMessage === "string" ? serverMessage : undefined,
    );
  }

  return (await response.json()) as T;
}
