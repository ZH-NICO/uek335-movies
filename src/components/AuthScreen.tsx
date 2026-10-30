import type { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenTitle } from "@/components/ScreenTitle";

interface AuthScreenProps {
  title: string;
  subtitle: string;
  // Content above the title, e.g. the app logo or a back button.
  header: ReactNode;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  // Text and link below the button that lead to the other auth screen.
  switchText: string;
  switchLabel: string;
  onSwitch: () => void;
  children: ReactNode;
}

// Shared layout of login and sign up. The main action stays at the bottom in the thumb zone,
// and the content scrolls so all fields stay reachable with an open keyboard.
export function AuthScreen({
  title,
  subtitle,
  header,
  submitLabel,
  isSubmitting,
  onSubmit,
  switchText,
  switchLabel,
  onSwitch,
  children,
}: AuthScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.main}>
            {header}
            <ScreenTitle title={title} subtitle={subtitle} />
            {children}
          </View>
          <View style={styles.footer}>
            <Button
              mode="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
              onPress={onSubmit}
              contentStyle={styles.submit}
            >
              {submitLabel}
            </Button>
            <View style={styles.switchRow}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {switchText}
              </Text>
              <Button mode="text" compact disabled={isSubmitting} onPress={onSwitch}>
                {switchLabel}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    gap: 24,
    padding: 16,
  },
  main: {
    gap: 16,
  },
  footer: {
    gap: 4,
  },
  submit: {
    height: 48,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
