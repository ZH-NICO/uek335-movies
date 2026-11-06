import { StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

interface StatCardProps {
  /** Large number, e.g. "24". */
  value: string;
  /** Short text below the number, e.g. "Movies". */
  label: string;
}

/** Small card with one key figure, used in a row on the home screen. */
export function StatCard({ value, label }: StatCardProps) {
  const theme = useTheme();

  return (
    <Card mode="outlined" style={styles.card}>
      <Card.Content>
        <Text variant="headlineSmall" style={styles.value}>
          {value}
        </Text>
        <Text variant="bodySmall" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
          {label}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  /** The cards share the width of the row equally. */
  card: {
    flex: 1,
  },
  value: {
    fontWeight: "700",
  },
});
