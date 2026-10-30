import { MD3LightTheme, type MD3Theme } from "react-native-paper";

// App theme based on the Figma mockup.
// All colors are defined here only, so components never contain hex values.
export const theme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#007AFF",
    onPrimary: "#FFFFFF",
    primaryContainer: "#D6E8FF",
    onPrimaryContainer: "#003A7A",
    error: "#FF3B30",
    onError: "#FFFFFF",
    errorContainer: "#FFE5E3",
    onErrorContainer: "#8A1A14",
    background: "#F2F2F7",
    onBackground: "#000000",
    surface: "#FFFFFF",
    onSurface: "#000000",
    surfaceVariant: "#E9E9EE",
    onSurfaceVariant: "#8E8E93",
    outline: "#C7C7CC",
  },
};
