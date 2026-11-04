import { View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";

import { ErrorBox } from "@/components/ErrorBox";

interface LoadStatusProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

// Shows the loading or error state of a screen, with a way to try again after an error.
export function LoadStatus({ isLoading, error, onRetry }: LoadStatusProps) {
  if (error) {
    return (
      <View style={{ gap: 8 }}>
        <ErrorBox title="Could not load data" message={error} />
        <Button mode="outlined" onPress={onRetry}>
          Try again
        </Button>
      </View>
    );
  }

  return isLoading ? <ActivityIndicator accessibilityLabel="Loading" /> : null;
}
