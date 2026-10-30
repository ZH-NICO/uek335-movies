import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { theme } from "@/constants/theme";
import { AuthProvider } from "@/context/AuthContext";
import { SnackbarProvider } from "@/context/SnackbarContext";

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SnackbarProvider>
          <Stack screenOptions={{ contentStyle: { backgroundColor: theme.colors.background } }} />
        </SnackbarProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
