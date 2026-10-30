import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenTitle } from "@/components/ScreenTitle";

interface TabScreenProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

// Base layout of a tab. The tab bar already handles the bottom safe area.
export function TabScreen({ title, subtitle, children }: TabScreenProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScreenTitle title={title} subtitle={subtitle} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
