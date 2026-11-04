import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Card, Divider, Text, useTheme } from "react-native-paper";

import { ApiError } from "@/api/client";
import { getMovie } from "@/api/movieApi";
import { Poster } from "@/components/Poster";
import { ScreenTitle } from "@/components/ScreenTitle";
import { StatusView } from "@/components/StatusView";
import type { Movie } from "@/types/movie";

// Fallback for values that are missing in the backend.
const NO_VALUE = "–";

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 404) {
    return "This movie does not exist anymore. Go back to the list.";
  }
  return error instanceof ApiError ? error.message : "The movie could not be loaded. Please try again.";
}

interface DetailRowProps {
  label: string;
  value: string;
}

// One line in the detail card: label on the left, value on the right.
function DetailRow({ label, value }: DetailRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        {label}
      </Text>
      <Text variant="bodyMedium" style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

export default function MovieDetails() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  // Loads the movie when the screen opens and again when the user taps "Try again".
  useEffect(() => {
    let isCurrent = true;

    getMovie(Number(id))
      .then((result) => {
        if (isCurrent) {
          setMovie(result);
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(errorMessage(loadError));
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [id, reloadCount]);

  function retry() {
    setIsLoading(true);
    setError(null);
    setReloadCount((count) => count + 1);
  }

  function renderContent() {
    if (isLoading) {
      return <StatusView status="loading" />;
    }
    if (error || !movie) {
      return <StatusView status="error" message={error ?? errorMessage(null)} onRetry={retry} />;
    }

    const rating = movie.imdbRating != null ? `★ ${movie.imdbRating} / 10 IMDb` : "No IMDb rating";
    const rows: DetailRowProps[] = [
      { label: "Director", value: movie.director ?? NO_VALUE },
      { label: "Genre", value: movie.majorGenre ?? NO_VALUE },
      { label: "Release date", value: movie.releaseDate },
      { label: "Running time", value: movie.runningTimeMin != null ? `${movie.runningTimeMin} min` : NO_VALUE },
      {
        label: "Rotten Tomatoes",
        value: movie.rottenTomatoesRating != null ? `${movie.rottenTomatoesRating} %` : NO_VALUE,
      },
    ];

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Poster url={movie.posterUrl} iconSize={48} style={styles.poster} />
        <ScreenTitle title={movie.title} subtitle={rating} />
        <Card mode="outlined">
          {rows.map((row, index) => (
            <View key={row.label}>
              {index > 0 && <Divider />}
              <DetailRow label={row.label} value={row.value} />
            </View>
          ))}
        </Card>
      </ScrollView>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} accessibilityLabel="Back to movies" />
        <Appbar.Content title="Movies" titleStyle={{ color: theme.colors.primary }} />
      </Appbar.Header>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 16,
  },
  poster: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  value: {
    flexShrink: 1,
    fontWeight: "600",
    textAlign: "right",
  },
});
