import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface ScreenTitleProps {
  title: string;
  subtitle: string;
}

// Large title with a short description below it, used at the top of every screen.
export function ScreenTitle({ title, subtitle }: ScreenTitleProps) {
  const theme = useTheme();

  return (
    <View>
      <Text variant="headlineMedium" style={{ fontWeight: "700" }}>
        {title}
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {subtitle}
      </Text>
    </View>
  );
}
