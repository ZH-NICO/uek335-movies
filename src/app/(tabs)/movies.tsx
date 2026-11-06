import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { ActivityIndicator, FAB, Searchbar } from "react-native-paper";

import { ApiError } from "@/api/client";
import { getMovies, PAGE_SIZE, type MovieFilters } from "@/api/movieApi";
import { FilterChips } from "@/components/FilterChips";
import { MovieCard } from "@/components/MovieCard";
import { StatusView } from "@/components/StatusView";
import { TabScreen } from "@/components/TabScreen";
import { useSnackbar } from "@/context/SnackbarContext";
import type { Movie } from "@/types/movie";

/** Time to wait after the last key press, so not every letter sends a request. */
const SEARCH_DELAY_MS = 400;

/**
 * @param error - Error of a request.
 * @returns Message for the user.
 */
function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Movies could not be loaded. Please try again.";
}

/** Movies tab: list of all movies with search, filters and loading more pages while scrolling. */
export default function Movies() {
  const router = useRouter();
  const { showMessage } = useSnackbar();
  /** Changes when a deleted movie was restored while this screen is already visible. */
  const { refresh } = useLocalSearchParams<{ refresh?: string }>();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<MovieFilters>({});
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  const hasFilters = filters.genre !== undefined || filters.year !== undefined || filters.minRating !== undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextQuery = search.trim();
      if (nextQuery !== query) {
        setIsLoading(true);
        setError(null);
        setQuery(nextQuery);
      }
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search, query]);

  /**
   * Loads the first page when the screen comes into focus, so new, changed and deleted movies are up to date,
   * and again whenever search or filters change or the user taps "Try again".
   */
  useFocusEffect(
    useCallback(() => {
      /** Ignores the answer of an older search that arrives after a newer one. */
      let isCurrent = true;

      getMovies(1, { ...filters, search: query })
        .then((result) => {
          if (isCurrent) {
            setMovies(result);
            setPage(1);
            setHasMore(result.length === PAGE_SIZE);
            setError(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- these values only trigger a new load
    }, [query, filters, reloadCount, refresh]),
  );

  /**
   * Appends the next page when the user scrolls to the end of the list.
   * On an error the loaded movies stay visible and a snackbar explains what happened.
   */
  async function loadNextPage() {
    if (isLoading || isLoadingMore || !hasMore) {
      return;
    }
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getMovies(nextPage, { ...filters, search: query });
      setMovies((current) => [...current, ...result]);
      setPage(nextPage);
      setHasMore(result.length === PAGE_SIZE);
    } catch (loadError) {
      showMessage(errorMessage(loadError));
    } finally {
      setIsLoadingMore(false);
    }
  }

  /** Shows the loading state right away, so the old list is not shown with the new filters. */
  function changeFilters(newFilters: MovieFilters) {
    setIsLoading(true);
    setError(null);
    setFilters(newFilters);
  }

  /** Loads the first page again after an error. */
  function retry() {
    setIsLoading(true);
    setError(null);
    setReloadCount((count) => count + 1);
  }

  /** The exact number of results is only known once the last page is loaded. */
  let subtitle = "All movies from MovieCruxStudios";
  if (query || hasFilters) {
    const searchText = query ? ` for «${query}»` : "";
    subtitle =
      !isLoading && !hasMore
        ? `${movies.length} ${movies.length === 1 ? "result" : "results"}${searchText}`
        : `Results${searchText}`;
  }

  /** Shows the list, or the loading, error or empty state. */
  function renderContent() {
    if (isLoading) {
      return <StatusView status="loading" />;
    }
    if (error) {
      return <StatusView status="error" message={error} onRetry={retry} />;
    }
    if (movies.length === 0) {
      return (
        <StatusView
          status="empty"
          message={
            query || hasFilters
              ? "No movies match your search. Try another title or remove a filter."
              : "There are no movies yet."
          }
        />
      );
    }
    return (
      <FlatList
        data={movies}
        keyExtractor={(movie) => String(movie.id)}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => router.push({ pathname: "/movies/[id]", params: { id: String(item.id) } })}
          />
        )}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingMore ? <ActivityIndicator style={styles.footer} /> : undefined}
        contentContainerStyle={styles.list}
      />
    );
  }

  return (
    <TabScreen title="Movies" subtitle={subtitle}>
      <Searchbar placeholder="Search by title" value={search} onChangeText={setSearch} />
      <FilterChips filters={filters} onChange={changeFilters} />
      {renderContent()}
      <FAB
        icon="plus"
        label="New movie"
        style={styles.fab}
        onPress={() => router.push("/movies/new")}
      />
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  // Leaves room so the last card is not hidden behind the button.
  list: {
    paddingBottom: 88,
  },
  footer: {
    marginVertical: 16,
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 16,
  },
});
