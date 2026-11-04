import { useState } from "react";
import { ScrollView } from "react-native";
import { Avatar, Button, Card, Divider, List, useTheme } from "react-native-paper";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadStatus } from "@/components/LoadStatus";
import { TabScreen } from "@/components/TabScreen";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { useFocusRequest } from "@/hooks/useFocusRequest";
import type { User } from "@/types/user";

export default function Profile() {
  const theme = useTheme();
  const { userId, logout } = useAuth();
  const { showMessage } = useSnackbar();
  const { data: user, error, isLoading, retry } = useFocusRequest<User>(`/users/${userId}`);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  async function confirmLogout() {
    setIsDialogVisible(false);
    try {
      await logout();
    } catch {
      showMessage("Could not log out. Please try again.");
    }
  }

  return (
    <TabScreen
      title="Profile"
      subtitle="Your account at MovieCruxStudios."
      action={
        <Button textColor={theme.colors.error} onPress={() => setIsDialogVisible(true)}>
          Log out
        </Button>
      }
    >
      <LoadStatus isLoading={isLoading} error={error} onRetry={retry} />
      {user && (
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          <Card mode="outlined">
            <Card.Title
              title={user.email}
              titleNumberOfLines={2}
              subtitle="Logged in with this email"
              left={(props) => <Avatar.Icon {...props} icon="account" />}
            />
            <Divider />
            <List.Item title="First name" description={user.firstname ?? "Not provided"} />
            <List.Item title="Last name" description={user.lastname ?? "Not provided"} />
            <List.Item title="Age" description={user.age ?? "Not provided"} />
          </Card>
        </ScrollView>
      )}
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
