import { router } from "expo-router";
import { ScrollView } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import { LoadStatus } from "@/components/LoadStatus";
import { TabScreen } from "@/components/TabScreen";
import { useFocusRequest } from "@/hooks/useFocusRequest";
import type { Movie } from "@/types/movie";

export default function Home() {
  const { data: movies, error, isLoading, retry } = useFocusRequest<Movie[]>("/movies?_sort=imdbRating&_order=desc");
  // The sorted list can start with movies without a rating, so the first rated movie is the top movie.
  const topMovie = movies?.find((movie) => movie.imdbRating != null);

  return (
    <TabScreen title="Home" subtitle="Overview of MovieCruxStudios.">
      <LoadStatus isLoading={isLoading} error={error} onRetry={retry} />
      {movies && (
        <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
          <Card mode="outlined">
            <Card.Content>
              <Text variant="labelLarge">Movies in the catalog</Text>
              <Text variant="displaySmall">{movies.length}</Text>
            </Card.Content>
          </Card>
          <Card mode="outlined">
            <Card.Content>
              <Text variant="labelLarge">Top movie</Text>
              {topMovie ? (
                <>
                  <Text variant="titleLarge">{topMovie.title}</Text>
                  <Text variant="bodyMedium">★ {topMovie.imdbRating} / 10 IMDb</Text>
                </>
              ) : (
                <Text variant="bodyMedium">No rated movies yet.</Text>
              )}
            </Card.Content>
          </Card>
          <Button mode="contained" onPress={() => router.push("/movies")}>
            Browse movies
          </Button>
        </ScrollView>
      )}
    </TabScreen>
  );
}
