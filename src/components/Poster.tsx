import { useState } from "react";
import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from "react-native";
import { Icon, useTheme } from "react-native-paper";

interface PosterProps {
  /** Link to the image, often missing in the backend. */
  url?: string | null;
  iconSize: number;
  style: StyleProp<ImageStyle>;
}

/**
 * Movie poster with an icon as fallback.
 * Many poster links in the backend are missing or broken, so both cases show the icon.
 */
export function Poster({ url, iconSize, style }: PosterProps) {
  const theme = useTheme();
  const [hasError, setHasError] = useState(false);

  if (!url || hasError) {
    return (
      <View style={[style, styles.placeholder, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Icon source="movie-open-outline" size={iconSize} color={theme.colors.onSurfaceVariant} />
      </View>
    );
  }

  return <Image source={{ uri: url }} style={style} resizeMode="cover" onError={() => setHasError(true)} />;
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
});
