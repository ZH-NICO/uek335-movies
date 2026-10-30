import { StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

interface ErrorBoxProps {
  title: string;
  message: string;
}

// Red box for errors that do not belong to a single field, e.g. wrong credentials.
export function ErrorBox({ title, message }: ErrorBoxProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="alert"
      style={[styles.box, { backgroundColor: theme.colors.errorContainer, borderColor: theme.colors.error }]}
    >
      <Icon source="alert-circle-outline" size={18} color={theme.colors.error} />
      <View style={styles.text}>
        <Text variant="labelLarge" style={{ color: theme.colors.onErrorContainer }}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onErrorContainer }}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  text: {
    flex: 1,
  },
});
