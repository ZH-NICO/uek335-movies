import { router } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";

import { ErrorBox } from "@/components/ErrorBox";
import { StatusView } from "@/components/StatusView";
import { TabScreen } from "@/components/TabScreen";
import { useFocusRequest } from "@/hooks/useFocusRequest";
import type { Movie } from "@/types/movie";

/** Home tab: overview with the number of movies and the best rated movie. */
export default function Home() {
  const theme = useTheme();
  const { data: movies, error, retry } = useFocusRequest<Movie[]>("/movies?_sort=imdbRating&_order=desc");
  /** The backend sorts movies without a rating first, so the first rated movie is the top movie. */
  const topMovie = movies?.find((movie) => movie.imdbRating != null);

  /** Shows the overview, or the loading or error state until the movies are loaded. */
  function renderContent() {
    if (!movies) {
      return error ? <StatusView status="error" message={error} onRetry={retry} /> : <StatusView status="loading" />;
    }

    return (
      <ScrollView contentContainerStyle={styles.content}>
        {error && <ErrorBox title="Could not refresh" message={error} />}
        <Card mode="outlined">
          <Card.Content>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Movies in the catalog
            </Text>
            <Text variant="displaySmall" style={styles.bold}>
              {movies.length}
            </Text>
          </Card.Content>
        </Card>
        <Card mode="outlined">
          <Card.Content>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Top movie
            </Text>
            {topMovie ? (
              <>
                <Text variant="titleLarge" style={styles.bold}>
                  {topMovie.title}
                </Text>
                <Text variant="bodyMedium">★ {topMovie.imdbRating} / 10 IMDb</Text>
              </>
            ) : (
              <Text variant="bodyMedium">No rated movies yet.</Text>
            )}
          </Card.Content>
        </Card>
        <Button mode="contained" contentStyle={styles.button} labelStyle={styles.bold} onPress={() => router.push("/movies")}>
          Browse movies
        </Button>
      </ScrollView>
    );
  }

  return (
    <TabScreen title="Home" subtitle="Overview of MovieCruxStudios.">
      {renderContent()}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 16,
  },
  bold: {
    fontWeight: "700",
  },
  button: {
    height: 48,
  },
});
