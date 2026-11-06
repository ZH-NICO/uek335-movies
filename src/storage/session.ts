import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "accessToken";
const USER_ID_KEY = "userId";

/** Login data that survives an app restart. */
export interface Session {
  accessToken: string;
  userId: number;
}

/**
 * Stores the session encrypted in SecureStore (Android Keystore / iOS Keychain),
 * because the token grants access to all data.
 *
 * @param session - Token and user ID from the login or sign up.
 */
export async function saveSession(session: Session): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, session.accessToken);
  await SecureStore.setItemAsync(USER_ID_KEY, String(session.userId));
}

/**
 * Loads the stored session on app start.
 *
 * @returns The session, or null if nobody is logged in or one of the values is missing.
 */
export async function loadSession(): Promise<Session | null> {
  const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
  const userId = await SecureStore.getItemAsync(USER_ID_KEY);
  if (!accessToken || !userId) {
    return null;
  }
  return { accessToken, userId: Number(userId) };
}

/**
 * Reads only the token, for the Authorization header of each request.
 *
 * @returns The token, or null if none is stored.
 */
export function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

/** Deletes the session on logout, so nothing of the account stays on the device. */
export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_ID_KEY);
}
