import { StyleSheet, View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";

import type { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

// One movie in the list: title, "year · genre" and the IMDb rating.
// Missing values are left out, because many movies in the backend are incomplete.
export function MovieCard({ movie, onPress }: MovieCardProps) {
  const theme = useTheme();
  // releaseDate is text like "Sep 03 2009", the year is always at the end.
  const year = movie.releaseDate.slice(-4);
  const subtitle = [year, movie.majorGenre].filter(Boolean).join(" · ");

  return (
    <Card mode="outlined" onPress={onPress} style={styles.card} accessibilityLabel={`Open ${movie.title}`}>
      <Card.Content style={styles.content}>
        <View style={styles.text}>
          <Text variant="titleMedium">{movie.title}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {subtitle}
          </Text>
          {movie.imdbRating != null && (
            <View style={styles.rating}>
              <Icon source="star" size={14} color={theme.colors.primary} />
              <Text variant="labelLarge">{movie.imdbRating}</Text>
            </View>
          )}
        </View>
        <Icon source="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    flex: 1,
    gap: 2,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
