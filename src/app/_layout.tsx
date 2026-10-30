import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, PaperProvider } from "react-native-paper";

import { theme } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SnackbarProvider } from "@/context/SnackbarContext";

// Shows login or tabs depending on the session. Protected screens are removed from the stack,
// so login, logout and an expired token all switch screens here and leave no way back.
function RootNavigator() {
  const { userId, isRestoring } = useAuth();

  if (isRestoring) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Protected guard={userId !== null}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={userId === null}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SnackbarProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </SnackbarProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
