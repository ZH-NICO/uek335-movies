import Constants from "expo-constants";

/**
 * IP of the computer that runs "npx expo start".
 * The backend runs on the same computer, so the app reaches it from the emulator
 * and from a real phone in the same network without changing the code.
 */
const host = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";

/** Base URL of the rest-jsondb backend. */
export const API_URL = `http://${host}:3030`;
