import { StyleSheet, View } from "react-native";
import { Icon, Text, TextInput, useTheme, type TextInputProps } from "react-native-paper";

export interface FormFieldProps extends Omit<TextInputProps, "label" | "error" | "mode"> {
  label: string;
  // Shown below the field as long as there is no error.
  hint?: string;
  error?: string;
}

// Text field with a label above it and a hint or error text below it.
export function FormField({ label, hint, error, ...inputProps }: FormFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={styles.label}>
        {label}
      </Text>
      <TextInput
        {...inputProps}
        mode="outlined"
        accessibilityLabel={label}
        error={error !== undefined}
        outlineStyle={styles.outline}
        style={[styles.input, { backgroundColor: theme.colors.surface }]}
      />
      {error && (
        <View style={styles.error}>
          <Icon source="alert-circle-outline" size={14} color={theme.colors.error} />
          <Text variant="bodySmall" style={{ color: theme.colors.error }}>
            {error}
          </Text>
        </View>
      )}
      {!error && hint && (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontWeight: "600",
  },
  input: {
    height: 48,
  },
  outline: {
    borderRadius: 10,
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
