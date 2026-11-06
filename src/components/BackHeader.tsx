import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Button, useTheme } from "react-native-paper";

interface BackHeaderProps {
  /** Name of the screen the back button returns to. */
  label: string;
  /** Optional actions on the right side. */
  children?: ReactNode;
}

/** Top bar of screens that are opened from another screen. */
export function BackHeader({ label, children }: BackHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
      <Button icon="chevron-left" mode="text" compact onPress={() => router.back()}>
        {label}
      </Button>
      <View style={styles.spacer} />
      {children}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
  },
});
