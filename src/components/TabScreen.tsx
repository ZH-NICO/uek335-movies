import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenTitle } from "@/components/ScreenTitle";

interface TabScreenProps {
  title: string;
  subtitle: string;
  // Optional button at the top right, next to the title.
  action?: ReactNode;
  children?: ReactNode;
}

// Base layout of a tab. The tab bar already handles the bottom safe area.
export function TabScreen({ title, subtitle, action, children }: TabScreenProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <ScreenTitle title={title} subtitle={subtitle} />
        </View>
        {action}
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
  },
});
