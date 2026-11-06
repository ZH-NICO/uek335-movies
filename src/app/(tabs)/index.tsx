import { router } from "expo-router";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TouchableRipple } from "react-native-paper";

import { ErrorBox } from "@/components/ErrorBox";
import { FeaturedMovieCard } from "@/components/FeaturedMovieCard";
import { Poster } from "@/components/Poster";
import { StatCard } from "@/components/StatCard";
import { StatusView } from "@/components/StatusView";
import { TabScreen } from "@/components/TabScreen";
import { useAuth } from "@/context/AuthContext";
import { useFocusRequest } from "@/hooks/useFocusRequest";
import type { Movie } from "@/types/movie";
import type { User } from "@/types/user";

/** Number of movies in the row below the key figures. */
const MORE_MOVIES_COUNT = 10;

/**
 * Opens the detail screen of a movie.
 *
 * @param movie - The movie the user tapped.
 */
function openMovie(movie: Movie) {
  router.push({ pathname: "/movies/[id]", params: { id: String(movie.id) } });
}

/** Home tab: greeting, the best rated movie, key figures and more movies to discover. */
export default function Home() {
  const { userId } = useAuth();
  const { data: user } = useFocusRequest<User>(`/users/${userId}`);
  const { data: movies, error, retry } = useFocusRequest<Movie[]>("/movies?_sort=imdbRating&_order=desc");

  /** The greeting is only a nice extra, so without a first name the screen still works. */
  const title = user?.firstname ? `Hello ${user.firstname}` : "Hello";
  const subtitle = "Your overview of all movies from MovieCruxStudios.";

  if (!movies) {
    return (
      <TabScreen title={title} subtitle={subtitle}>
        {error ? <StatusView status="error" message={error} onRetry={retry} /> : <StatusView status="loading" />}
      </TabScreen>
    );
  }

  /** The backend sorts movies without a rating first, so they are filtered out before taking the best one. */
  const ratedMovies = movies.filter((movie) => movie.imdbRating != null);
  const topMovie = ratedMovies[0];
  const moreMovies = ratedMovies.slice(1, MORE_MOVIES_COUNT + 1);
  const genreCount = new Set(movies.map((movie) => movie.majorGenre).filter(Boolean)).size;
  const ratingSum = ratedMovies.reduce((sum, movie) => sum + (movie.imdbRating ?? 0), 0);
  const averageRating = ratedMovies.length > 0 ? (ratingSum / ratedMovies.length).toFixed(1) : "–";

  return (
    <TabScreen title={title} subtitle={subtitle}>
      <ScrollView contentContainerStyle={styles.content}>
        {error && <ErrorBox title="Could not refresh" message={error} />}
        {topMovie ? (
          <FeaturedMovieCard movie={topMovie} label="Top rated at MovieCruxStudios" onPress={() => openMovie(topMovie)} />
        ) : (
          <StatusView status="empty" message="There are no rated movies yet." />
        )}
        <View style={styles.stats}>
          <StatCard value={String(movies.length)} label="Movies" />
          <StatCard value={String(genreCount)} label="Genres" />
          <StatCard value={averageRating} label="Ø Rating" />
        </View>
        {moreMovies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.bold}>
                More top movies
              </Text>
              <Button compact labelStyle={styles.bold} onPress={() => router.push("/movies")}>
                See all
              </Button>
            </View>
            <FlatList
              horizontal
              data={moreMovies}
              keyExtractor={(movie) => String(movie.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.row}
              renderItem={({ item }) => (
                <TouchableRipple
                  onPress={() => openMovie(item)}
                  accessibilityLabel={`Open ${item.title}`}
                  borderless
                  style={styles.posterButton}
                >
                  <Poster url={item.posterUrl} iconSize={32} style={styles.poster} />
                </TouchableRipple>
              )}
            />
          </View>
        )}
      </ScrollView>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 16,
  },
  stats: {
    flexDirection: "row",
    gap: 8,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bold: {
    fontWeight: "700",
  },
  row: {
    gap: 12,
  },
  posterButton: {
    borderRadius: 12,
  },
  poster: {
    width: 120,
    height: 170,
    borderRadius: 12,
  },
});
