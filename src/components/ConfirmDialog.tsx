import { StyleSheet } from "react-native";
import { Avatar, Button, Dialog, Portal, Text, useTheme } from "react-native-paper";

interface ConfirmDialogProps {
  visible: boolean;
  // Name of a Material Community icon, e.g. "trash-can-outline".
  icon: string;
  title: string;
  message: string;
  // Label of the confirming action, e.g. "Delete".
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Asks for confirmation before an action that cannot be undone (delete, log out).
// The confirming action is red so it is not chosen by accident.
export function ConfirmDialog({
  visible,
  icon,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={{ backgroundColor: theme.colors.surface }}>
        <Avatar.Icon
          icon={icon}
          size={48}
          color={theme.colors.error}
          style={[styles.icon, { backgroundColor: theme.colors.errorContainer }]}
        />
        <Dialog.Title style={styles.centered}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={[styles.centered, { color: theme.colors.onSurfaceVariant }]}>
            {message}
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button mode="outlined" onPress={onCancel} style={styles.button}>
            Cancel
          </Button>
          <Button mode="contained" buttonColor={theme.colors.error} onPress={onConfirm} style={styles.button}>
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignSelf: "center",
    marginTop: 24,
  },
  centered: {
    textAlign: "center",
  },
  actions: {
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
