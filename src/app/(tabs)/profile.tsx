import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Divider, List, Text, useTheme } from "react-native-paper";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ErrorBox } from "@/components/ErrorBox";
import { StatusView } from "@/components/StatusView";
import { TabScreen } from "@/components/TabScreen";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { useFocusRequest } from "@/hooks/useFocusRequest";
import type { User } from "@/types/user";

/** Fallback for optional fields that were not entered at sign up. */
const NOT_PROVIDED = "Not provided";

/** Profile tab: shows the data of the logged-in user and lets the user log out. */
export default function Profile() {
  const theme = useTheme();
  const { userId, logout } = useAuth();
  const { showMessage } = useSnackbar();
  const { data: user, error, retry } = useFocusRequest<User>(`/users/${userId}`);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  /** Logs out after the user confirmed it. The root layout then switches to the login screen. */
  async function confirmLogout() {
    setIsDialogVisible(false);
    try {
      await logout();
    } catch {
      showMessage("Could not log out. Please try again.");
    }
  }

  /** Shows the user data, or the loading or error state until it is loaded. */
  function renderContent() {
    if (!user) {
      return error ? <StatusView status="error" message={error} onRetry={retry} /> : <StatusView status="loading" />;
    }

    return (
      <ScrollView contentContainerStyle={styles.content}>
        {error && <ErrorBox title="Could not refresh" message={error} />}
        <Card mode="outlined">
          <Card.Content style={styles.account}>
            <Avatar.Icon
              icon="account-outline"
              size={56}
              color={theme.colors.primary}
              style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}
            />
            <View style={styles.accountText}>
              <Text variant="titleMedium" style={styles.email}>
                {user.email}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Logged in with this email
              </Text>
            </View>
          </Card.Content>
        </Card>
        <Card mode="outlined">
          <List.Item title="First name" description={user.firstname ?? NOT_PROVIDED} />
          <Divider />
          <List.Item title="Last name" description={user.lastname ?? NOT_PROVIDED} />
          <Divider />
          <List.Item title="Age" description={user.age ?? NOT_PROVIDED} />
        </Card>
      </ScrollView>
    );
  }

  return (
    <TabScreen
      title="Profile"
      subtitle="Your account at MovieCruxStudios."
      action={
        <Button
          icon="logout"
          compact
          textColor={theme.colors.error}
          labelStyle={styles.logout}
          onPress={() => setIsDialogVisible(true)}
        >
          Log out
        </Button>
      }
    >
      {renderContent()}
      <ConfirmDialog
        visible={isDialogVisible}
        icon="logout"
        title="Log out?"
        message="You will need to log in again to use the app."
        confirmLabel="Log out"
        onConfirm={confirmLogout}
        onCancel={() => setIsDialogVisible(false)}
      />
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 16,
  },
  account: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    borderRadius: 14,
  },
  accountText: {
    flex: 1,
  },
  email: {
    fontWeight: "700",
  },
  logout: {
    fontWeight: "700",
  },
});
