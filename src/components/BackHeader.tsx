import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Appbar, useTheme } from "react-native-paper";

interface BackHeaderProps {
  // Name of the screen the back button returns to.
  label: string;
  // Optional actions on the right side.
  children?: ReactNode;
}

// Top bar of screens that are opened from another screen.
export function BackHeader({ label, children }: BackHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
      <Appbar.BackAction onPress={() => router.back()} accessibilityLabel={`Back to ${label}`} />
      <Appbar.Content title={label} titleStyle={{ color: theme.colors.primary }} />
      {children}
    </Appbar.Header>
  );
}
