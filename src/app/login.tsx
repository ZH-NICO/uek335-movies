import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";

import { ApiError } from "@/api/client";
import { AuthScreen } from "@/components/AuthScreen";
import { ErrorBox } from "@/components/ErrorBox";
import { FormField } from "@/components/FormField";
import { PasswordField } from "@/components/PasswordField";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validateLoginPassword } from "@/utils/validation";

export default function Login() {
  const theme = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Errors only appear after the first submit, so an empty form is not shown as wrong.
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const emailError = validateEmail(email);
  const passwordError = validateLoginPassword(password);

  async function handleLogin() {
    setIsSubmitted(true);
    setFailure(null);
    if (emailError || passwordError) {
      return;
    }

    setIsSubmitting(true);
    try {
      // After the login, the root layout switches to the tabs.
      await login({ email: email.trim(), password });
    } catch (error) {
      setFailure(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Log in"
      subtitle="Log in with your account."
      header={
        <View style={styles.brand}>
          <Avatar.Icon
            icon="filmstrip"
            size={48}
            color={theme.colors.onTertiary}
            style={[styles.logo, { backgroundColor: theme.colors.tertiary }]}
          />
          <View>
            <Text variant="labelLarge">Movie Details Checker</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              MovieCruxStudios
            </Text>
          </View>
        </View>
      }
      submitLabel="Log in"
      isSubmitting={isSubmitting}
      onSubmit={handleLogin}
      switchText="No account yet?"
      switchLabel="Sign up"
      onSwitch={() => router.push("/register")}
    >
      {failure && <ErrorBox title="Login failed" message={failure} />}
      <FormField
        label="Email"
        placeholder="name@example.ch"
        value={email}
        onChangeText={setEmail}
        error={isSubmitted ? emailError : undefined}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <PasswordField
        label="Password"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        error={isSubmitted ? passwordError : undefined}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  brand: {
    gap: 8,
    marginTop: 24,
  },
  logo: {
    borderRadius: 12,
  },
});
