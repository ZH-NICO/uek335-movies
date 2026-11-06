import { StyleSheet, View } from "react-native";
import { Button, Icon, Text, useTheme } from "react-native-paper";

import { Poster } from "@/components/Poster";
import type { Movie } from "@/types/movie";

interface FeaturedMovieCardProps {
  movie: Movie;
  /** Label above the title, e.g. "Top rated". */
  label: string;
  onPress: () => void;
}

/**
 * Large card with the poster in the background, used to highlight one movie on the home screen.
 * A dark layer lies over the poster, so the white text stays readable on every image.
 */
export function FeaturedMovieCard({ movie, label, onPress }: FeaturedMovieCardProps) {
  const theme = useTheme();
  const white = theme.colors.onPrimary;

  return (
    <View style={styles.card}>
      <Poster url={movie.posterUrl} iconSize={64} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.backdrop }]} />
      <View style={styles.content}>
        <View style={[styles.label, { borderColor: white }]}>
          <Text variant="labelMedium" style={{ color: white }}>
            {label}
          </Text>
        </View>
        <Text variant="headlineMedium" numberOfLines={2} style={[styles.title, { color: white }]}>
          {movie.title}
        </Text>
        {movie.imdbRating != null && (
          <View style={styles.rating}>
            <Icon source="star" size={16} color={white} />
            <Text variant="labelLarge" style={{ color: white }}>
              {movie.imdbRating} / 10 IMDb
            </Text>
          </View>
        )}
        <Button
          mode="contained"
          buttonColor={theme.colors.surface}
          textColor={theme.colors.primary}
          labelStyle={styles.title}
          onPress={onPress}
          style={styles.button}
        >
          View details
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  content: {
    gap: 8,
    padding: 20,
  },
  label: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  title: {
    fontWeight: "700",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  button: {
    alignSelf: "flex-start",
  },
});
