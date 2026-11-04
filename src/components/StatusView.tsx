import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Icon, Text, useTheme } from "react-native-paper";

type StatusViewProps =
  | { status: "loading" }
  | { status: "error"; message: string; onRetry: () => void }
  | { status: "empty"; message: string };

// Shows a full-screen state instead of a list: loading, an error with "Try again", or no results.
// Used by every movie screen, so these states look the same everywhere.
export function StatusView(props: StatusViewProps) {
  const theme = useTheme();

  if (props.status === "loading") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" accessibilityLabel="Loading" />
      </View>
    );
  }

  const isError = props.status === "error";

  return (
    <View style={styles.container}>
      <Icon
        source={isError ? "wifi-off" : "movie-search-outline"}
        size={48}
        color={theme.colors.onSurfaceVariant}
      />
      <Text variant="bodyLarge" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
        {props.message}
      </Text>
      {isError && (
        <Button mode="contained" onPress={props.onRetry}>
          Try again
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  message: {
    textAlign: "center",
  },
});
