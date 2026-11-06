import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import {
  loginUser,
  registerUser,
  type AuthResponse,
  type Credentials,
  type RegistrationData,
} from "@/api/authApi";
import { setUnauthorizedHandler } from "@/api/client";
import { clearSession, loadSession, saveSession } from "@/storage/session";

interface AuthContextValue {
  /** ID of the logged-in user, or null if nobody is logged in. */
  userId: number | null;
  /** True while the stored session is being loaded on app start. */
  isRestoring: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (registration: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Provides login, registration and logout for the whole app
 * and restores a stored session on app start.
 *
 * @param props.children - The app, which gets access to useAuth().
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    setUnauthorizedHandler(logout);

    loadSession()
      .then((session) => setUserId(session?.userId ?? null))
      /** If the storage cannot be read, the app starts logged out instead of crashing. */
      .catch(() => setUserId(null))
      .finally(() => setIsRestoring(false));
  }, []);

  /** Deletes the stored session. The root layout then shows the login screen. */
  async function logout() {
    await clearSession();
    setUserId(null);
  }

  /**
   * Stores token and user ID after a successful login or sign up.
   *
   * @param response - Answer of the backend.
   */
  async function startSession(response: AuthResponse) {
    await saveSession({ accessToken: response.accessToken, userId: response.user.id });
    setUserId(response.user.id);
  }

  /**
   * @param credentials - Email and password.
   * @throws ApiError if the credentials are wrong or the server cannot be reached.
   */
  async function login(credentials: Credentials) {
    await startSession(await loginUser(credentials));
  }

  /**
   * @param registration - Data of the new account.
   * @throws ApiError if the email is taken or the server cannot be reached.
   */
  async function register(registration: RegistrationData) {
    await startSession(await registerUser(registration));
  }

  return (
    <AuthContext.Provider value={{ userId, isRestoring, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Access to the login state and the auth functions.
 *
 * @returns userId, isRestoring, login, register and logout.
 * @throws Error if used outside of AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
