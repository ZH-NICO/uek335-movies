import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

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
  // ID of the logged-in user, or null if nobody is logged in.
  userId: number | null;
  // True while the stored session is being loaded on app start.
  isRestoring: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Provides login, registration and logout for the whole app
// and restores a stored session on app start.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  const logout = useCallback(async () => {
    await clearSession();
    setUserId(null);
  }, []);

  useEffect(() => {
    loadSession()
      .then((session) => setUserId(session?.userId ?? null))
      // If the storage cannot be read, the app starts logged out instead of crashing.
      .catch(() => setUserId(null))
      .finally(() => setIsRestoring(false));
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => void logout());
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  async function startSession(response: AuthResponse) {
    await saveSession({ accessToken: response.accessToken, userId: response.user.id });
    setUserId(response.user.id);
  }

  async function login(credentials: Credentials) {
    await startSession(await loginUser(credentials));
  }

  async function register(data: RegistrationData) {
    await startSession(await registerUser(data));
  }

  return (
    <AuthContext.Provider value={{ userId, isRestoring, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Access to the login state and the auth functions.
// Throws if used outside of AuthProvider.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
