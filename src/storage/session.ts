import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "accessToken";
const USER_ID_KEY = "userId";

// Login data that survives an app restart.
export interface Session {
  accessToken: string;
  userId: number;
}

// Stores the session encrypted in SecureStore (Android Keystore / iOS Keychain),
// because the token grants access to all data.
export async function saveSession(session: Session): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, session.accessToken);
  await SecureStore.setItemAsync(USER_ID_KEY, String(session.userId));
}

// Returns the stored session, or null if nobody is logged in.
export async function loadSession(): Promise<Session | null> {
  const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
  const userId = await SecureStore.getItemAsync(USER_ID_KEY);
  if (!accessToken || !userId) {
    return null;
  }
  return { accessToken, userId: Number(userId) };
}

// Returns only the token (for the Authorization header), or null if none is stored.
export function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

// Deletes the session on logout.
export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_ID_KEY);
}
