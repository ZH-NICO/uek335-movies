import { Button } from "react-native-paper";

import { TabScreen } from "@/components/TabScreen";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { logout } = useAuth();

  return (
    <TabScreen title="Profile" subtitle="Your account at MovieCruxStudios.">
      <Button mode="outlined" onPress={logout}>
        Log out
      </Button>
    </TabScreen>
  );
}
