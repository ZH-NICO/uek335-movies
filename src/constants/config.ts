import { Platform } from "react-native";

// Base URL of the rest-jsondb backend.
// In the Android emulator 10.0.2.2 points to the host machine, "localhost" would be the emulator itself.
// On a real phone this has to be the IP address of the computer in the local network.
export const API_URL = Platform.select({
  android: "http://10.0.2.2:3030",
  default: "http://localhost:3030",
});
